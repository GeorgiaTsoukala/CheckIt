import { StyleSheet, Text, Dimensions, TouchableOpacity, View, TouchableWithoutFeedback, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Timestamp, addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { auth, datab } from '../firebase';
import moment from 'moment';
import globalStyles, { colors } from '../globalStyles';
import Card from './CardComponent';
import Toast from 'react-native-simple-toast';
import { ActivityIndicator, Button, Modal, PaperProvider, Portal } from 'react-native-paper';

const { width } = Dimensions.get('window');

const ChecklistScreen = () => {
  const [value, setValue] = useState(new Date()); //keeps today's date
  const [tsValue, setTsValue] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false); //open-close mood pop-up
  const [selectedEmotion, setSelectedEmotion] = useState(null); 
  const [checkboxStates, setCheckboxStates] = useState([]); //track the checkbox states
  const [catGoals, setCatGoals] = useState({});  //get the selected categories from the database
  const [savedData, setSavedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatGoals = async () => {
      try {
        const querySnapshot = await getDocs(collection(datab, "users", auth.currentUser.uid, "categories"));
        const categoryGoals = {};

        querySnapshot.forEach(async (categoryDoc) => {
          const goals = categoryDoc.data().goals;
          categoryGoals[categoryDoc.id] = goals;
        });

        setCatGoals(categoryGoals);
        setCheckboxStates(new Array(categoryGoals['Health'].length).fill(false))
      } catch (error) {
        console.error('Error fetching selected categories and goals:', error);
      }
    }

    fetchCatGoals();  

  }, []);

  const mydays = React.useMemo(() => {
    const days = [];

    for (let i = 6; i > -1; i--) {
      const date = moment(new Date()).subtract(i, 'day');
      days.push({
        weekday: date.format('ddd'),
        date: date.toDate(),
      });
    }

    return days;
  }, []); 

  useEffect(() => {
    handleCalendarTap(new Date());
  }, [catGoals]);

  // handle calendar date selection
  const handleCalendarTap = async (selectedDate) => {
    setValue(selectedDate);

    // save current timestamp
    const currentTime = moment();

    // save combined calendar date with current time
    const combinedDateTime = moment(selectedDate).set({
      hour: currentTime.hour(),
      minute: currentTime.minute(),
      second: currentTime.second()
    });
    setTsValue(combinedDateTime.toDate());

    // Check if catGoals and catGoals['Health'] are defined
    if (!catGoals || !catGoals['Health']) {
      // console.error("Category goals are not yet loaded or 'Health' category goals are not set.");
      return; // Exit early to avoid accessing undefined properties
    }

    setCheckboxStates(Array(catGoals['Health'].length).fill(false));

    // Fetch date's data
    try {
      const dailyDataRef = collection(datab, "users", auth.currentUser.uid, "dailydata");

      // Set selectedDate to midnight (start of the day)
      selectedDate.setHours(0, 0, 0, 0);

      // Calculate the start and end timestamps for the selected date
      const startTimestamp = Timestamp.fromDate(selectedDate);
      const endTimestamp = Timestamp.fromMillis(selectedDate.getTime() + 86400000); // Add 24 hours to selectedDate

      // Create a Firestore query to retrieve documents for the selected date
      const q = query(
        dailyDataRef,
        where('timestamp', '>=', startTimestamp), // Greater than or equal to start of selectedDate
        where('timestamp', '<', endTimestamp) // Less than end of selectedDate (start of next day)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setSavedData(true);
        
        querySnapshot.forEach((doc) => {

          let fetchedGoals = doc.data().goals;

          // Initialize checkboxStates with all false values
          let checkboxStatesSaved = Array(catGoals['Health'].length).fill(false);          

          // Iterate over fetchedGoals and set corresponding checkboxStates to true
          fetchedGoals.forEach((goal) => {
            const index = catGoals['Health'].indexOf(goal);
            if (index !== -1) {
              checkboxStatesSaved[index] = true;
            }
          });

          setCheckboxStates(checkboxStatesSaved);

        });
      } else {
        setSavedData(false);
      }

      setLoading(false);

    } catch (error) {
      console.error('Error fetching selected categories:', error);
      setLoading(false);

    }
    
  }

  // function to update checkbox states
  const handleCheckboxToggle = (index) => {
    const newCheckboxStates = [...checkboxStates];
    newCheckboxStates[index] = !newCheckboxStates[index]
    setCheckboxStates(newCheckboxStates);
  };

  // call handleSave when you are done with the checklist
  const handleSave = async () => {
      // open mood popup 
      setModalOpen(true);
  }

  // call handleFinish when you are done with the emotion selection
  const handleFinish = async () => {
    const dailyGoals = catGoals['Health'].filter((_, index) => checkboxStates[index]);

    try {
      //save selected daily goals and emotion in a dailydata document with auto generated doc id
      await addDoc(collection(datab, "users", auth.currentUser.uid, "dailydata"), {timestamp: tsValue, goals: dailyGoals, emotion: selectedEmotion});

      handleCalendarTap(value);

      // close popup
      setModalOpen(false) 
      // initialize emotion state to null
      setSelectedEmotion(null)

      Toast.show('Saved! Good job!')


    } catch (error) {
      alert(error.message);

      Toast.show('Something went wrong...')

    }      
  }

  return (
    <PaperProvider>
      <View style={globalStyles.body}>

        {/* popup */}       
        <Portal>
          <Modal visible={modalOpen} 
            dismissable={true}  
            onDismiss={() => (setModalOpen(false))} 
            contentContainerStyle={styles.modalBody}
          >
            <Text style={[globalStyles.title, {fontSize: 25}]}>Let's wrap up your day!</Text>
            <Text style={globalStyles.subtitle}>How did you feel overall today?</Text>
            <View style={styles.emotionList}>
              <TouchableOpacity 
                onPress={() => setSelectedEmotion('very_sad')}
                style={selectedEmotion === 'very_sad' ? { opacity: 1 } : { opacity: 0.7 }}
              >
                <Image style={styles.emotionItem} source={require('../assets/emotions/very_sad.png')} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelectedEmotion('sad')}
                style={selectedEmotion === 'sad' ? { opacity: 1 } : { opacity: 0.7 }}
              >
                <Image style={styles.emotionItem} source={require('../assets/emotions/sad.png')} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelectedEmotion('neutral')}
                style={selectedEmotion === 'neutral' ? { opacity: 1 } : { opacity: 0.7 }}
              >
                <Image style={styles.emotionItem} source={require('../assets/emotions/neutral.png')} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelectedEmotion('happy')}
                style={selectedEmotion === 'happy' ? { opacity: 1 } : { opacity: 0.7 }}
              >
                <Image style={styles.emotionItem} source={require('../assets/emotions/happy.png')} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSelectedEmotion('very_happy')}
                style={selectedEmotion === 'very_happy' ? { opacity: 1 } : { opacity: 0.7 }}
              >
                <Image style={styles.emotionItem} source={require('../assets/emotions/very_happy.png')} />
              </TouchableOpacity>
            </View>
            <View style={[globalStyles.center, globalStyles.btnContainer, { bottom: 30}]} >
              <Button mode="contained" 
                onPress={handleFinish} 
                disabled={selectedEmotion == null}
                style={globalStyles.button} 
                buttonColor='black'
              >
                <Text style={globalStyles.btnText}>Finish</Text>
              </Button>
            </View>
          </Modal>
        </Portal>       
       
        {/* calendar */}
        <View style={styles.picker}>
          <View
            style={[styles.itemRow, { paddingHorizontal: 8 }]}
          >
            {mydays.map((item, dateIndex) => {
              const isActive = value.toDateString() === item.date.toDateString();
              return (
                <TouchableWithoutFeedback
                  key={dateIndex}
                  onPress={() => handleCalendarTap(item.date)}>
                  <View
                    style={[
                      styles.item,
                      isActive && {
                        backgroundColor: 'black',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.itemWeekday,
                        isActive && {
                          color: colors.grey50,
                        },
                      ]}>
                      {item.weekday}
                    </Text>
                    <Text
                      style={[
                        styles.itemDate,
                        isActive && {
                          color: colors.grey50,
                        },
                      ]}>
                      {item.date.getDate()}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </View>

        {loading ? (
          <View style={{paddingTop: 50}}>
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : (
          <>
      
        {/* header */}
        { savedData ?
          <View style={globalStyles.center}>  
            <Text style={globalStyles.title}>Your day</Text>
            <Text style={globalStyles.subtitle}>The goals you accomplished on {value.toDateString()}</Text>
          </View>
          :
          <View style={globalStyles.center}>
            <Text style={globalStyles.title}>How was your day?</Text>
            <Text style={globalStyles.subtitle}>What goals are you satisfied with for today?</Text>
          </View>
        }

        {/*category cards*/}
        <FlatList
          style = {{flex: 1}}
          data={Object.entries(catGoals)}
          horizontal= {false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Card category={item[0]} goals={item[1]} checkboxStates={checkboxStates || []} onToggle={(index) => handleCheckboxToggle(index)} savedData={savedData}/>}
          ListFooterComponent={<View style={{ height: 160 }}/>}
        />

        {/* button */}
        { !savedData && 
          <View style={[globalStyles.center, globalStyles.btnContainer, {bottom: 120}]} >
            <Button mode="contained" onPress={handleSave} style={globalStyles.button} buttonColor='black'>
              <Text style={globalStyles.btnText}>Save</Text>
            </Button>
          </View>
        }   
        </>
        )}
      </View>
    </PaperProvider>
  )
}

export default ChecklistScreen

const styles = StyleSheet.create({
  // popup
  modalBody: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingTop: 30,
    borderRadius: 20,
    elevation: 20,
  },
  emotionList: {
    flexDirection: 'row',
    marginBottom: 130 ///////////// WHY???
  },
  emotionItem: {
    width: 46, 
    height: 46,
    marginHorizontal: 5
  },

  // date picker
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20
  },
  /** Item */
  item: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemWeekday: {
    fontSize: 18,
    color: colors.grey600,
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 18,
    color: colors.grey600
  },

  // checkbox
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  goalTxt: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    flexWrap: 'wrap',
  },
  containerCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#d0b8e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxInactive: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#a9a9a9',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

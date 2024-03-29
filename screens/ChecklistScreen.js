import { StyleSheet, Text, Dimensions, TouchableOpacity, View, TouchableWithoutFeedback, FlatList } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { collection, getDocs } from 'firebase/firestore';
import { auth, datab } from '../firebase';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ChecklistScreen = () => {
  const [value, setValue] = useState(new Date());

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

  // Get the selected categories from the database

  const [catGoals, setCatGoals] = useState({});

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
      } catch (error) {
        console.error('Error fetching selected categories and goals:', error);
      }
    }

    fetchCatGoals();  

  }, []);

  // call the handleNext when you are done with the checklist

  const handleNext = () => {
    // navigation.navigate("MoodPage")

    console.log(catGoals)
  }

  return (
    <View style={styles.body}>

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
                    onPress={() => setValue(item.date)}>
                    <View
                      style={[
                        styles.item,
                        isActive && {
                          backgroundColor: '#D7B4EC',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.itemWeekday,
                        ]}>
                        {item.weekday}
                      </Text>
                      <Text
                        style={[
                          styles.itemDate,
                        ]}>
                        {item.date.getDate()}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })}
            </View>
      </View>

      {/* header */}
      <View style={styles.center}>
        {/* <Text style={styles.subtitle}>{value.toDateString()}</Text> */}
        <Text style={styles.title}>How was your day?</Text>
        <Text style={styles.subtitle}>What goals are you satisfied with for today?</Text>
      </View>

      {/* category cards */}      
      <FlatList
        style = {{flex: 1, marginBottom: '25%'}}
        data={Object.entries(catGoals)}
        horizontal= {false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Card category={item[0]} goals={item[1]} />}
        numColumns={2}
      />

      {/* button */}

      <View style={[styles.center, styles.btnContainer]}>
        <TouchableOpacity
          onPress={handleNext}
          style={styles.button}
        >
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default ChecklistScreen

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#F6E8F3',
  },
  center: {
    alignItems: 'center',
  },
  title: {
    color: '#63086B',
    fontSize: 32,
  },
  subtitle: {
    width: '70%',
    marginTop: 32,
    marginBottom: 50,
    fontSize: 18,
    textAlign: 'center', 
  },
  button: {
    width: '60%',
    backgroundColor: '#AA7DC6',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 20,
    fontWeight: '500',
  },
  btnContainer: {
    position: 'absolute', 
    bottom: 30, 
    width: '100%'
  },

  // date picker
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50
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
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 16,
    fontWeight: '500',
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

  // card
  cardContainer: cardIsActive => ({ 
    maxWidth: width/2 -10 ,
    flex: 1, 
    flexDirection: 'column', 
    marginVertical: 5, 
    marginHorizontal: 5, 
    backgroundColor: cardIsActive ? '#A2B1F760' : '#d3d3d3', 
    borderRadius: 20,
    opacity: cardIsActive ? 1 : 0.5,
    padding: 16 
  }),
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5
  }
})

const Card = ({ category, goals }) => {
  const cardIsActive = category == 'Health';

  return (   
    <View style={styles.cardContainer(cardIsActive)}>
      <View>
        <Text style={styles.cardTitle}>{category}</Text>
      </View>
      <View>
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalContainer}>
            {cardIsActive ?
              <TouchableOpacity 
                onPress={() => {}}//handleToggle(index, goalIndex)} 
                style={styles.containerCheckBox}
              >
                {/* check checkbox state  */}
                  <AntDesign name="checksquare" size={24} color="#8E2EA6" />
                {/* : <View style={styles.checkBox} />  */}
              </TouchableOpacity>
              : <View style={styles.checkBoxInactive} />
            } 
              <Text style={styles.goalTxt}>{goal}</Text>
            </View>
        ))}
      </View>
    </View>
  );
};
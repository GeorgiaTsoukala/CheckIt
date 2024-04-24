import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth, datab } from '../firebase';
import { MaterialIcons } from '@expo/vector-icons';
import globalStyles from '../globalStyles';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Card, Chip, MD3Colors, ProgressBar, Title } from 'react-native-paper';
import moment from 'moment';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState(""); 
  const [catGoals, setCatGoals] = useState({});  //get the selected categories from the database
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [goals, setGoals] = useState([]);
  const [activeButton, setActiveButton] = useState("");

  useEffect(() => {
    updateScreen();
    fetchCatGoals(); 
  }, []);

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

  const updateScreen = async () => {
    const response = await getDoc(doc(datab, "users", auth.currentUser.uid));
    if (response?.data() && response.data().name) {      
      setName(response.data().name);
    }
  };

  const handleSignOut = async () => {
    try {      
      await signOut(auth).then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'IconGetStarted' }]
        });
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const getCardData = async () => {
    // save current timestamp
    const currentTimestamp = moment();    

    // Fetch data
    try {
      const dailyDataRef = collection(datab, "users", auth.currentUser.uid, "dailydata");

      // Set currentTimestamp to midnight (start of the day)
      currentTimestamp.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      
      // Calculate the start and end timestamps for the week back
      const startTimestamp = currentTimestamp.clone().subtract(7, 'days').toDate();
      const endTimestamp = currentTimestamp.toDate();
      
      // Create a Firestore query to retrieve documents for the selected dates
      const q = query(
        dailyDataRef,
        where('timestamp', '>=', startTimestamp), // Greater than or equal to start of selectedDate
        where('timestamp', '<', endTimestamp) // Less than end of selectedDate (start of next day)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {        
        querySnapshot.forEach((doc) => {
          console.log(doc.data())
        });
      } else {
        setSavedData(false);
      }

    } catch (error) {
      console.error('Error fetching selected categories:', error);
    }
    
  }

  // Toggles the selection state of a category
  const handleChipPress = (category) => {
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
    getCardData();
  };

  return (
    <View style={globalStyles.body}>
      <View style={globalStyles.center}>

        {/* log out icon */}
        <MaterialIcons
          name="logout"
          size={20}
          style={{
            alignSelf: "flex-end",
            marginTop: 25,
            marginRight: 25,
            color: "black",
          }}
          onPress={handleSignOut}
        />

        <Text style={globalStyles.title}>Hello {name}</Text>
        <Text style={globalStyles.subtitle}>You are doing great so far!</Text>

        {/* categories */}
        <ScrollView horizontal>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom : 10}}>
            {Object.keys(catGoals).map((key) => (
              <Chip
                key={key}
                style={{ margin: 4 }}
                selected={selectedCategory === key}
                onPress={() => handleChipPress(key)}
                disabled={key !== 'Health'}
              >
                {key}
              </Chip>
            ))}
          </View>
        </ScrollView>

        {/* goal cards */}
        <ScrollView horizontal>
          {selectedCategory &&
            catGoals[selectedCategory].map((goal, index) => (
              <Card mode="elevated" key={index} style={{ margin: 10, width: 200, height: 105 }}>
                <Card.Title title={goal} />
                <Card.Content style={{ marginTop: 10 }}>
                    <Text style={{ marginBottom: 5 }}>4/7 this week</Text>
                    <ProgressBar progress={0.5} color={"#8E2EA6"} />
                </Card.Content>
              </Card>
            ))}
        </ScrollView>

        {/* graph */}
        <Text style={globalStyles.subtitle}>The graph goes here</Text>

      </View>      
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%'
  },
  button: {
    backgroundColor: '#8E2EA6',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    width: '25%',
  },
  buttonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'light',
  },
  activeButton: {
    backgroundColor: '#FFFFFF',
  },
  activeButtonText: {
    color: 'black',
  },
  goalsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  goalsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  goalBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  noGoalsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});




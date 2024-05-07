import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth, datab } from '../firebase';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import globalStyles, { catIcons, colors } from '../globalStyles';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryStack} from "victory-native";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { Card, Chip, Divider, MD3Colors, ProgressBar, Title } from 'react-native-paper';
import moment from 'moment';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState(""); // user's name
  const [catGoals, setCatGoals] = useState({});  // stores the selected categories and their goals
  const [goalProgress, setGoalProgress] = useState({}); // stores the progress data for each goal
  const [selectedCategory, setSelectedCategory] = useState(null); //selected category from Chip to be displayed
  const [streak, setStreak] = useState(0); // holds the streak information

  useEffect(() => {
    setSelectedCategory('Health');

    updateScreen();
    fetchCatGoals(); 
    getCardData();
    getStreak();
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
      await signOut(auth); //.then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'IconGetStarted' }]
      });
      //});
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
        where('timestamp', '>=', startTimestamp), 
        where('timestamp', '<', endTimestamp) 
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const progressData = {};
  
        // Count occurrences of each goal
        querySnapshot.forEach((doc) => {
          const { goals } = doc.data();
          goals.forEach((goal) => {
            progressData[goal] = (progressData[goal] || 0) + 1;
          });
        });
  
        // Save fraction progress for each goal
        const totalDays = 7;
        const goalProgressFraction = {};
        Object.keys(progressData).forEach((goal) => {
          goalProgressFraction[goal] = `${progressData[goal]}/${totalDays}`;
        });
  
        // Update state with progress data
        setGoalProgress(goalProgressFraction);
      } else {
        // No data found
        setGoalProgress({});
      }

    } catch (error) {
      console.error('Error fetching selected categories:', error);
    }
    
  }

  const getStreak = async () => {
    try {
      const dailyDataRef = collection(datab, "users", auth.currentUser.uid, "dailydata");
      const q = query(
        dailyDataRef,
        orderBy('timestamp', 'desc') // ensure the data is ordered chronologically
      );
  
      const querySnapshot = await getDocs(q);
      let currentStreak = 0;
      let previousDate = moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD');

      let firstDateSkipped = false;

      querySnapshot.forEach((doc) => {
        // get the next date of the daily data
        const date = moment(doc.data().timestamp.toDate()).format('YYYY-MM-DD');
        
        // If the previous date is null or the consecutive date, increment the streak
        if (!firstDateSkipped && moment(date).isSame(moment(new Date()).format('YYYY-MM-DD'))) {
          firstDateSkipped = true;
          return; // Skip the first date
        }
  
        // If the previous date is null or the consecutive date, increment the streak
        if (!previousDate || moment(previousDate).isSame(date)) {
          currentStreak++;
        }
  
        // go to the previous calendar date
        previousDate = moment(previousDate).subtract(1, 'day').format('YYYY-MM-DD');

      });
  
      setStreak(currentStreak);
    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  };

  // Toggles the selection state of a category
  const handleChipPress = (category) => {
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24}}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 20}}>
            {Object.keys(catGoals).map((key) => (
              <Chip
                theme={{colors: {secondaryContainer: colors.health}}}
                icon={({ size, color }) => (
                    <MaterialCommunityIcons name={catIcons[key]} size={20} color= {key === 'Health' ? "#000" : 'grey'} />
                )}
                rippleColor={'transparent'}
                key={key}
                style={{marginRight: 8, borderRadius: 50, paddingHorizontal: 16, paddingVertical: 10, fontSize:24}}
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {catGoals[selectedCategory] &&
            catGoals[selectedCategory].map((goal, index) => (
              <Card mode="contained" key={index} style={[styles.card, index == 0 && {marginLeft: 20}]}>
                <Card.Title
                  title="This Week"
                  subtitle={goal}
                  titleStyle={{ color: colors.grey400, fontSize: 14, fontWeight: 'normal' }}
                  subtitleStyle={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}
                />
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.progressText}>{goalProgress[goal] || '0/7'}</Text>
                  <ProgressBar
                    progress={goalProgress[goal] ? parseInt(goalProgress[goal].split('/')[0]) / 7 : 0}
                    color={colors.health}
                    style={styles.progressBar}
                  />
                </Card.Content>
              </Card>
            ))
          }
        </ScrollView>

        {/* strike */}
        {catGoals[selectedCategory] && (
          <Card mode="contained" style={styles.strikeCard}>
            <Card.Title
              title="Your current streak"
              subtitle="Keep it up!"
              titleStyle={{ color: colors.grey400, fontSize: 14, fontWeight: 'normal' }}
              subtitleStyle={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}
            />
            <Card.Content style={styles.cardContent}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                <Text style={{fontSize: 35, fontWeight: 'bold'}}>{streak}</Text>
                <MaterialCommunityIcons name="fire" size={35} color="black"/>
              </View>        
            </Card.Content>           
          </Card>
        )}

      </View>      
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    width: 175,
    height: 175,
    backgroundColor: 'white'
  },
  cardContent: {
    marginTop: 25,
  },
  progressBar: {
    height: 4,
    borderRadius: 5,
    backgroundColor: 'black',
  },
  progressText: {
    marginBottom: 5,
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  strikeCard: {
    marginTop: 24,
    marginHorizontal: 10,
    width: "90%",
    backgroundColor: 'white'
  },
});




import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth, datab } from '../firebase';
import { MaterialIcons } from '@expo/vector-icons';
import globalStyles, { colors } from '../globalStyles';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryStack} from "victory-native";
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Card, Chip, MD3Colors, ProgressBar, Title } from 'react-native-paper';
import moment from 'moment';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState(""); // user's name
  const [catGoals, setCatGoals] = useState({});  // store the selected categories and their goals
  const [goalProgress, setGoalProgress] = useState({}); // store the progress data for each goal
  const [selectedCategory, setSelectedCategory] = useState(null); //selected category from Chip to be displayed

  useEffect(() => {
    updateScreen();
    fetchCatGoals(); 
    getCardData();
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
              <Card mode="contained" key={index} style={styles.card}>
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
            ))}
        </ScrollView>

        {/* graph */}
        {/* <Text style={globalStyles.subtitle}>The graph goes here</Text> */}
        {/* <VictoryChart
            height={200}
            domainPadding={15}
            padding={{left: 70, top: 50, bottom: 40, right: 20}}
          >
            <VictoryLabel
              text={"Strike of your last 14 days"}
              x={Dimensions.get('window').width / 2} // Adjust this value to center the title horizontally
              y={30} // Adjust this value to position the title vertically
              textAnchor="middle"
              // style={{ fontSize: 18, fill: "#333" }}
            />
            <VictoryAxis
              dependentAxis
              tickValues={ [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]} 
            />
            <VictoryStack
              horizontal
              // height={150}
              colorScale={["grey", "green"]}
            >
              <VictoryBar
                data={[
                  {x: 'Eating\nhealthy', y: 0},
                  {x: 'Sleeping\nenough', y: 2},
                  {x: 'Exercise', y: 1}
                ]}
                barWidth={30}
                // barRatio={1.0} 
              />
              <VictoryBar
                data={[
                  {x: 'Eating\nhealthy', y: 1},
                  {x: 'Sleeping\nenough', y: 1},
                  {x: 'Exercise', y: 4}
                ]}
                barWidth={30}
              />
              <VictoryBar
                data={[
                  {x: 'Eating\nhealthy', y: 3},
                  {x: 'Sleeping\nenough', y: 1},
                  {x: 'Exercise', y: 3}
                ]}
                barWidth={30}
              />
               <VictoryBar
                data={[
                  {x: 'Eating\nhealthy', y: 2},
                  {x: 'Sleeping\nenough', y: 1},
                  {x: 'Exercise', y: 0}
                ]}
                barWidth={30}
              />
            </VictoryStack>
            <VictoryAxis/>
          </VictoryChart> */}

      </View>      
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  card: {
    margin: 10,
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




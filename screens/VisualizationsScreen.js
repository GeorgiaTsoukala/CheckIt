import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import globalStyles from '../globalStyles'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, datab } from '../firebase';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTheme } from "victory-native";
import { RadioButton } from 'react-native-paper';


const VisualizationsScreen = () => {
  const [viewMode, setViewMode] = useState('day') // Initially set to 'day'
  const [goals, setGoals] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [barData, setBarData] = useState([]) //Data for bar plot

  // Call fetchAllGoalsAndData when component mounts
  useEffect(() => {

    const fetchAllGoalsAndData = async () => {
      try {

        // fetch goals
        const querySnap = await getDoc(doc(datab, "users", auth.currentUser.uid, "categories", "Health"));

        const allGoals = querySnap.data().goals;

        setGoals(allGoals);

        // fetch dailydata
        const querySnapshot = await getDocs(collection(datab, "users", auth.currentUser.uid, "dailydata"));

        const allData = []

        querySnapshot.forEach(async (dataDoc) => {
          const mydata = dataDoc.data();
          allData.push(mydata)
        });

        setData(allData);
        
      } catch (error) {
        console.error('Error fetching the selected goals and data:', error);
      } finally {
        setLoading(false)
      }
    }

    fetchAllGoalsAndData();

  }, []);

  useEffect(() => {
    const getDataPerWeek = async () => {
      const goalsCount = {
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0,
        "Sunday": 0
      }

      const entriesCount = {
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0,
        "Sunday": 0
      }

      const getDayOfWeek = (tmsp) => {
        return tmsp.toLocaleDateString('en-US', { weekday: 'long' });
      };

      data.forEach(entry => {
        if (entry.goals) {
          const tmsp = new Date(entry.timestamp.seconds * 1000 + entry.timestamp.nanoseconds / 1000000);
          const dayOfWeek = getDayOfWeek(tmsp);
          console.log('day', dayOfWeek)
          goalsCount[dayOfWeek] += entry.goals.length;
          entriesCount[dayOfWeek] += 1;
        }
      });

      const averageGoals = {};
      const complPercent = {};
      for (const day in goalsCount) {
        console.log(goalsCount[day], entriesCount[day])
        console.log('BOO', day, averageGoals[day], goals)
        entriesCount[day] != 0 ? averageGoals[day] = goalsCount[day] / entriesCount[day] : averageGoals[day] = -1;
        complPercent[day] = averageGoals[day]/goals.length * 100 
      }

      const barplotData = []
      for (const day in complPercent) {
        barplotData.push({ day: day, value: complPercent[day]})
      }
      console.log('here', barplotData)
      setBarData(barplotData)

    }

    if(!loading) {
      getDataPerWeek();
    }

  }, [data, loading])

  // Function to update bar data based on view mode
  const updateBarData = () => {
    if (viewMode === 'day') {
      setBarData(dayBarData);
    } else {
      setBarData(monthBarData);
    }
  };

// Call updateBarData whenever viewMode changes
  useEffect(() => {
    updateBarData();
  }, [viewMode]);

  return (
    <View style = {globalStyles.body}>
      <View style = {globalStyles.center}>
        <Text style = {globalStyles.title}>Your Progress</Text>
      </View>

      {/* The following is for debugging purposes */}
      {/* <View>
        {Object.entries(complPercentPerDay).map(([day, average]) => (
          <Text key={day}>{day}: {average.toFixed(2)} %</Text>
        ))}
      </View> */}

      <View style={styles.toggleContainer}>
        <Text style={{ fontSize: 18}}>View most productive</Text>
        <RadioButton.Group onValueChange={value => setViewMode(value)} value={viewMode}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton.Item label="Days" value="day" color="#63086B" />
            <RadioButton.Item label="Months" value="month" color="#63086B" />
          </View>
        </RadioButton.Group>
      </View>

      {loading ?
        <View style={{flex: 1, justifyContent:'center'}}>
          <ActivityIndicator size="large" color="#63086B" />
        </View>
      : (
        <View style={styles.container}>
          <VictoryChart
            // domainPadding will add space to each side of VictoryBar to
            // prevent it from overlapping the axis
            domainPadding={30}
            theme={VictoryTheme.material}
          >
            <VictoryLabel
              text={viewMode === 'day' ? "Most Productive Days" : "Most Productive Months"}
              x={205} // Adjust this value to center the title horizontally
              y={30} // Adjust this value to position the title vertically
              textAnchor="middle"
              style={{ fontSize: 18, fill: "#333" }}
          />
            <VictoryAxis
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              tickValues={viewMode === 'day' ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} // Adjust based on view mode
              tickFormat={viewMode === 'day' ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
              style={{
                tickLabels: { fontSize: 12, color: '#86929e' },
                // axis: { stroke: "transparent" }, // Hide the axis line
              }}
            />
            <VictoryAxis
              dependentAxis
              // tickFormat specifies how ticks should be displayed
              tickFormat={(x) => (`${x}%`)}
              style={{
                tickLabels: { fontSize: 12, color: '#86929e' },
                // axis: { stroke: "transparent" }, // Hide the axis line
              }}
            />
            <VictoryBar
              data={barData}
              x="day"
              y="value"
              barWidth={16}
              cornerRadius='8'
              style={{
                data: { fill: '#FF8743' },
              }}
            />
          </VictoryChart>
        </View>
      )} 
    </View>
  )
}

export default VisualizationsScreen

const styles = StyleSheet.create({
   container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    // alignSelf: 'center', // Add this line
    marginBottom: 20,
  },
})


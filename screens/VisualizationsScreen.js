import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import globalStyles from '../globalStyles'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, datab } from '../firebase';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryPie, VictoryScatter, VictoryTheme } from "victory-native";
import { RadioButton } from 'react-native-paper';

const { width } = Dimensions.get('window');

const VisualizationsScreen = () => {
  const [viewModeBar, setViewModeBar] = useState('days') // For Bar plot, initially set to 'days'
  const [viewModeScatter, setViewModeScatter] = useState('days') // For Scatter plot, initially set to 'days'
  const [goals, setGoals] = useState([])
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [pieData, setPieData] = useState([]) //Data for pie plot
  const [scatterData, setScatterData] = useState([]) //Data for scatter plot
  const [barData, setBarData] = useState([])
  const [barDailyData, setBarDailyData] = useState([]) //Daily Data for bar plot
  const [barMonthlyData, setBarMonthlyData] = useState([]) //Monthly Data for bar plot


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

    const getDataPerWeekDay = async () => {
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

          goalsCount[dayOfWeek] += entry.goals.length;
          entriesCount[dayOfWeek] += 1;
        }
      });

      const averageGoals = {};
      const complPercent = {};
      for (const day in goalsCount) {
        entriesCount[day] != 0 ? averageGoals[day] = goalsCount[day] / entriesCount[day] : averageGoals[day] = 0; 
        complPercent[day] = averageGoals[day]/goals.length * 100 
      }

      const barplotData = []
      for (const day in complPercent) {
        barplotData.push({ tag: day, value: complPercent[day]})
      }
      //console.log('here', barplotData)
      setBarDailyData(barplotData)
      setBarData(barplotData)

    }

    const getDataPerMonth = async () => {
      const goalsCount = {
        "January": 0,
        "February": 0,
        "March": 0,
        "April": 0,
        "May": 0,
        "June": 0,
        "July": 0,
        "August": 0,
        "September": 0,
        "October": 0,
        "November": 0,
        "December": 0
      }

      const entriesCount = {
        "January": 0,
        "February": 0,
        "March": 0,
        "April": 0,
        "May": 0,
        "June": 0,
        "July": 0,
        "August": 0,
        "September": 0,
        "October": 0,
        "November": 0,
        "December": 0
      }

      const getMonth = (tmsp) => {
        const date = new Date(tmsp.seconds * 1000); // Convert seconds to milliseconds

        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];

        return monthNames[date.getMonth()]; // getMonth() returns the month as a zero-based index (0 for January, 1 for February, etc.)
      };

      data.forEach(entry => {
        if (entry.goals) {
          const month = getMonth(entry.timestamp);
         
          goalsCount[month] += entry.goals.length;
          entriesCount[month] += 1;
        }
      });

      const averageGoals = {};
      const complPercent = {};
      for (const month in goalsCount) {
        entriesCount[month] != 0 ? averageGoals[month] = goalsCount[month] / entriesCount[month] : averageGoals[month] = 0;
        complPercent[month] = averageGoals[month]/goals.length * 100 
      }

      const barplotData = []
      for (const month in complPercent) {
        barplotData.push({ tag: month, value: complPercent[month]})
      }
      //console.log('here month', barplotData)
      setBarMonthlyData(barplotData)
    }

    const getDataForScatter = async () => {
      const pairCount = {}
     
      data.forEach(entry => {
        if (entry.goals && entry.emotion) {
          const complPercent = Math.round(entry.goals.length/goals.length * 10) * 10;

          const searchKey = `${entry.emotion}-${complPercent}`
          if(searchKey in pairCount) {
            pairCount[searchKey]++
          } else {
            pairCount[searchKey] = 1
          }
        }
      });

      // map emotions to get them on y-axis
      const emotionMap = {
        "very_sad" : 1,
        "sad" : 2,
        "neutral" : 3,
        "happy" : 4,
        "very_happy" : 5
      }

      const scatterplotData = []
      for (const key in pairCount) {
        const [key1, key2] = key.split('-')
        scatterplotData.push({ emotion: emotionMap[key1], value: parseInt(key2), amount: pairCount[key]})
      }
      // console.log('here Scatter', scatterplotData)
      setScatterData(scatterplotData)
    }

    const getDataForPie = async () => {
      const dataPie = {}
      goals.map((item) => {
        dataPie[item] = 0
      })
      
      data.forEach(entry => {
        if (entry.goals) {
          entry.goals.map((item) => {
            dataPie[item] ++;
          })
        }
      })
// hello
      const pieplotData = []
      for (const key in dataPie) {
        pieplotData.push({x: key, y: dataPie[key]})
      }
      console.log('my data pie', pieplotData)
      setPieData(pieplotData)
    }

    const fetchData = async () => {
      try {
        await getDataPerWeekDay();
        await getDataPerMonth();
        await getDataForScatter();
        await getDataForPie();
        console.log('!!!!data', barDailyData, barMonthlyData)
        
      } catch (error) {
        console.error('Error fetching the selected goals and data:', error);
      } 
    };

    fetchData();

  }, [data])

  // Function to update bar data based on view mode
  const updateBarData = () => {
    if (viewModeBar === 'days') {
      setBarData(barDailyData);
    } else {
      setBarData(barMonthlyData);
    }
  };

// Call updateBarData whenever viewModeBar changes
  useEffect(() => {
    updateBarData();
  }, [viewModeBar]);


  const sampleData = [
    { x: "Cats", y: 35 },
    { x: "Dogs", y: 40 },
    { x: "Birds", y: 55 }
  ];

  return (
    <View style = {globalStyles.body}>
      <View style = {globalStyles.center}>
        <Text style = {globalStyles.title}>Your Progress</Text>
      </View>

      {/* diagrams */}
      <ScrollView>

        {/* first diagram */}
        <View>
          <View style={styles.toggleContainer}>
            <Text style={{ fontSize: 18, marginRight: 25}}>Most productive</Text>
            <RadioButton.Group onValueChange={value => setViewModeBar(value)} value={viewModeBar}>
              <View style={{ flexDirection: 'row'}}>

                <Text style={{fontSize: 18, alignSelf: 'center'}}>Days</Text>
                <RadioButton value="days" color="#63086B"/>

                <Text style={{fontSize: 18, alignSelf: 'center', marginLeft: 5}}>Months</Text>
                <RadioButton value="months" color="#63086B"/>

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
                domainPadding={15}
                theme={VictoryTheme.material}
              >
                <VictoryLabel
                  text={viewModeBar === 'days' ? "Daily Accomplished Goals Percentage" : "Monthly Accomplished Goals Percentage"}
                  x={Dimensions.get('window').width / 2} // Adjust this value to center the title horizontally
                  y={30} // Adjust this value to position the title vertically
                  textAnchor="middle"
                  style={{ fontSize: 18, fill: "#333" }}
              />
                <VictoryAxis
                  // tickValues specifies both the number of ticks and where
                  // they are placed on the axis
                  tickValues={viewModeBar === 'days' ? [7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} 
                  tickFormat={viewModeBar === 'days' ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
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
                  x="tag"
                  y="value"
                  barWidth={16}
                  // cornerRadius='8' !!!DANGER!!!
                  style={{
                    data: { fill: '#A2B1F7' },
                  }}
                />
              </VictoryChart>
            </View>
          )}
        </View>

        {/* second diagram */}
        <View>
          {/* <View style={styles.toggleContainer}>
            <Text style={{ fontSize: 18, marginRight: 25}}>Emotions scatter</Text>
            <RadioButton.Group onValueChange={value => setViewModeScatter(value)} value={viewModeScatter}>
              <View style={{ flexDirection: 'row'}}>

                <Text style={{fontSize: 18, alignSelf: 'center'}}>Days</Text>
                <RadioButton value="days" color="#63086B"/>

                <Text style={{fontSize: 18, alignSelf: 'center', marginLeft: 5}}>Months</Text>
                <RadioButton value="months" color="#63086B"/>

              </View>
            </RadioButton.Group>
          </View> */}
          {loading ?
            <View style={{flex: 1, justifyContent:'center'}}>
              <ActivityIndicator size="large" color="#63086B" />
            </View>
          : (
            <View style={styles.container}>
              <VictoryChart
                // domainPadding will add space to each side of VictoryBar to
                // prevent it from overlapping the axis
                domainPadding={15}
                theme={VictoryTheme.material}
              >
                <VictoryLabel
                  text={viewModeScatter === 'days' ? "Relation of Emotions and Accomplished Goals" : "Monthly"}
                  x={Dimensions.get('window').width / 2} // Adjust this value to center the title horizontally
                  y={30} // Adjust this value to position the title vertically
                  textAnchor="middle"
                  style={{ fontSize: 18, fill: "#333" }}
              />
                <VictoryAxis
                  // tickValues specifies both the number of ticks and where
                  // they are placed on the axis
                  tickValues={[1, 2, 3, 4, 5]} 
                  tickFormat={["very sad", "sad", "neutral", "happy", "very happy"]}
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
                <VictoryScatter
                  style={{ data: { fill: "#c43a81" }, labels: { fill: "white", fontSize: 10}}}
                  bubbleProperty="amount"
                  maxBubbleSize={15}
                  minBubbleSize={5}
                  data={scatterData}
                  labels={({ datum }) => datum.amount}
                  labelComponent={<VictoryLabel dy={5}/>}
                  x="emotion"
                  y="value"
                />
              </VictoryChart>
            </View>
          )}
        </View>

         {loading ?
            <View style={{flex: 1, justifyContent:'center'}}>
              <ActivityIndicator size="large" color="#63086B" />
            </View>
          : (
            <View style={styles.container}>
              <VictoryPie
                colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
                data={pieData}
              />
            </View>
          )}
       
      
      </ScrollView>

    </View>
  )
}

export default VisualizationsScreen

const styles = StyleSheet.create({
   container: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  toggleContainer: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
})


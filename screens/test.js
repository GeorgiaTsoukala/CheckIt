import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import globalStyles from '../globalStyles'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, datab } from '../firebase';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTheme } from "victory-native";
import { RadioButton } from 'react-native-paper';


const VisualizationsScreen = () => {
  const [viewMode, setViewMode] = useState('months') // Initially set to 'days'
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
        // const month_index =  date.getMonth(); // Returns the month as a zero-based index (0 for January, 1 for February, etc.)
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];

        return monthNames[date.getMonth()];
      };

      data.forEach(entry => {
        if (entry.goals) {
          // const tmsp = new Date(entry.timestamp.seconds * 1000 + entry.timestamp.nanoseconds / 1000000);
          // console.log('month', entry.timestamp, month)

          const month = getMonth(entry.timestamp);
          console.log('month', entry.timestamp, month)
          goalsCount[month] += entry.goals.length;
          entriesCount[month] += 1;
        }
      });

      const averageGoals = {};
      const complPercent = {};
      for (const month in goalsCount) {
        console.log(goalsCount[month], entriesCount[month])
        console.log('BOO', month, averageGoals[month], goals)
        entriesCount[month] != 0 ? averageGoals[month] = goalsCount[month] / entriesCount[month] : averageGoals[month] = 0; //maybe -1
        complPercent[month] = averageGoals[month]/goals.length * 100 
      }

      const barplotData = []
      for (const month in complPercent) {
        barplotData.push({ month: month, value: complPercent[month]})
      }
      console.log('here month', barplotData)
      try {
        setBarData(barplotData)
      } catch (error) {
        console.error('Error fetching the selected goals and data:', error);
      }

    }

    if(!loading) {
      // getDataPerWeek();
      try {
        getDataPerMonth();
      } catch (error) {
        console.error('Error fetching the monthly data:', error);
      }
    }

  }, [data, loading])

  // Function to update bar data based on view mode
  const updateBarData = () => {
    if (viewMode === 'days') {
      //setBarData(dayBarData);
    } else {
      //setBarData(monthBarData);
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
        {Object.entries(barData).map(([day, average]) => (
          <Text key={day}>{day}: {average.toFixed(2)} %</Text>
        ))}
      </View> */}
      {/* {barData.map(item => (
        <View key={item.month} style={styles.item}>
          <Text style={styles.month}>{item.month}:</Text>
          <Text style={styles.value}>{item.value.toFixed(2)}</Text>
        </View>
      ))} */}

      <View style={styles.toggleContainer}>
        <Text style={{ fontSize: 18}}>Most productive</Text>
        <RadioButton.Group onValueChange={value => setViewMode(value)} value={viewMode}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton.Item label="Days" value="days" color="#63086B" />
            <RadioButton.Item label="Months" value="months" color="#63086B" />
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
            {/* <VictoryLabel
              text={"Monthly Accomplished Goals Percentage"}
              x={205} // Adjust this value to center the title horizontally
              y={30} // Adjust this value to position the title vertically
              textAnchor="middle"
              style={{ fontSize: 18, fill: "#333" }}
          /> */}
            <VictoryAxis
              // tickValues specifies both the number of ticks and where
              // they are placed on the axis
              tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} 
              tickFormat={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
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
              x="month"
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

          // <View style={{height: 24}}>
            {/* <Icon source="lightning-bolt"
              // color={MD3Colors.error50}
              // size={20}
            /> */}
            {/* <Image source={require('../../assets/categories/icon.png')} style={{height: '50%'}}/> */}
            {/* <SvgUri
              width="100"
              height="100"
              source={require('../../assets/categories/icon.svg')} 
              // uri="../../assets/categories/icon.svg"
            /> */}
          // </View>
          {/* <SvgUri
            width="100%"
            height="100%"
            uri={require('C:/Users/frena/react_projects/check-it-app/CheckIt-MobileApp/assets/categories/icon.svg')}
          /> */}
          {/* <SvgXml xml={MySVG} width="100" height="100" /> */}

          //  <MyComponentCheck mycolor={'black'}></MyComponentCheck>

          // export const MyComponentCheck = ({myBgColor, mycolor}) => {
          //     return (
          //         <View style={{backgroundColor: myBgColor, borderRadius: 45, padding: 8}}>
          //             <FontAwesome6 name="check" size={15} color={mycolor} />
          //         </View>
          //     )
          // }

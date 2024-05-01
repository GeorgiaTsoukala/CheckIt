import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import globalStyles, { catIcons, colors } from '../globalStyles'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, datab } from '../firebase';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryLegend, VictoryPie, VictoryScatter, VictoryTheme } from "victory-native";
import { Chip, Divider, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { height } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';

const VisualizationsScreen = () => {
  const [viewModeBar, setViewModeBar] = useState('days') // For Bar plot, initially set to 'days'
  const [categories, setCategories] = useState([]); //stores selected categories
  const [goals, setGoals] = useState([])
  const [data, setData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null); //selected category from Chip to be displayed

  const [newUser, setNewUser] = useState(false) // For new users that dont'd have daily data yet
  const [loadingUserState, setLoadingUserState] = useState(true) // Loading until it calculates if the user is new
  const [loading, setLoading] = useState(true)

  const [pieData, setPieData] = useState([]) // Data for pie plot
  const [scatterData, setScatterData] = useState([]) //Data for scatter plot
  const [barData, setBarData] = useState([])
  const [barDailyData, setBarDailyData] = useState([]) //Daily Data for bar plot
  const [barMonthlyData, setBarMonthlyData] = useState([]) //Monthly Data for bar plot

  const pieColorScale = ['#A2B1F7', '#FFCD58', '#A46AB4', '#5EBAB1', '#FFA256'];

  // Call fetchAllGoalsAndData when component mounts
  useEffect(() => {

    setSelectedCategory('Health')

    const fetchAllGoalsAndData = async () => {
      try {
        //fetch categories
        const queryS = await getDocs(collection(datab, "users", auth.currentUser.uid, "categories"));
        const categoryList = [];
        queryS.forEach((doc) => {
          categoryList.push(doc.id);  
        });
        setCategories(categoryList);

        // fetch goals
        const querySnap = await getDoc(doc(datab, "users", auth.currentUser.uid, "categories", "Health"));

        const allGoals = querySnap.data().goals;

        setGoals(allGoals);

        // fetch dailydata
        const querySnapshot = await getDocs(collection(datab, "users", auth.currentUser.uid, "dailydata"));

        if (querySnapshot.empty){
          setNewUser(true)
          setLoadingUserState(false)
        } else {
          setNewUser(false)
          setLoadingUserState(false)
          const allData = []

          querySnapshot.forEach(async (dataDoc) => {
            const mydata = dataDoc.data();
            allData.push(mydata)
          });

          setData(allData);
        }        
        
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

   // Toggles the selection state of a category
  const handleChipPress = (category) => {
    setSelectedCategory((prevCategory) => (prevCategory === category ? null : category));
  };
 
  return (
    <View style = {globalStyles.body}>
      <View style = {globalStyles.center}>
        <Text style = {[globalStyles.title, {marginTop: 45, marginBottom: 24}]}>Your Progress</Text>
      </View>

      {/* diagrams */}

      {newUser ? 
        <View style = {globalStyles.center}>
        <Text style = {[globalStyles.subtitle, {width: '90%', marginTop: 60}]}>You haven't checked any goals yet!</Text>
      </View>
      : (
        <View> 
          {/* categories */}
          {/* style:{{marginTop: 24, marginBottom: 16}} */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 16}}>
            <View style={{ flexDirection: 'row', marginLeft: 20}}>
              {categories.map((key) => (
                <Chip
                  theme={{colors: {secondaryContainer: colors.health}}}
                  icon={({ size, color }) => (
                      <MaterialCommunityIcons name={catIcons[key]} size={20} color="#000" />
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

          <ScrollView>
            {/* first diagram */}
            <View>          
              <View style={globalStyles.center}>  
                <Text style={styles.plotTitle}>{viewModeBar === 'days' ? "Daily Accomplished Goals Percentage" : "Monthly Accomplished Goals Percentage"}</Text>
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
                    padding={{ top: 10, bottom: 40, left: 50, right: 40 }} 
                    height={300}
                  >                
                    <VictoryAxis
                      // tickValues specifies both the number of ticks and where
                      // they are placed on the axis
                      tickValues={viewModeBar === 'days' ? [7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} 
                      tickFormat={viewModeBar === 'days' ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
                      style={{
                        tickLabels: { fontSize: 12, fill: colors.grey600 },
                        // axis: { stroke: "transparent" }, // Hide the axis line
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      // tickFormat specifies how ticks should be displayed
                      tickFormat={(x) => (`${x}%`)}
                      style={{
                        tickLabels: { fontSize: 12, fill: colors.grey600 },
                        // axis: { stroke: "transparent" }, // Hide the axis line
                      }}
                    />
                    <VictoryBar
                      data={barData}
                      x="tag"
                      y="value"
                      barWidth={16}
                      style={{
                        data: { fill: '#A2B1F7' },
                      }}
                    />
                  </VictoryChart>
                  <View style={{ alignItems: 'center', marginBottom:20 }}>
                    <SegmentedButtons
                      theme={{colors: {secondaryContainer:'#A2B1F7'}}}
                      style={{ width: 200}}
                      onValueChange={value => setViewModeBar(value)} 
                      value={viewModeBar}
                      buttons={[
                        {value: 'days', label: 'Days'},
                        {value: 'months', label: 'Months'}
                      ]}  
                    />
                  </View>
                </View>            
              )}
            </View>

            <Divider />

            {/* second diagram */}
            <View>
              <View style={globalStyles.center}>  
                <Text style={styles.plotTitle}>Relation of Emotions and Accomplished Goals</Text>
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
                    padding={{ top: 0, bottom: 50, left: 50, right: 40 }} 

                  >                
                    <VictoryAxis
                      // tickValues specifies both the number of ticks and where
                      // they are placed on the axis
                      tickValues={[1, 2, 3, 4, 5]} 
                      tickFormat={["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"]}
                      style={{
                        tickLabels: { fontSize: 12, fill: colors.grey600 },
                        // axis: { stroke: "transparent" }, // Hide the axis line
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      // tickFormat specifies how ticks should be displayed
                      tickFormat={(x) => {
                        if (x % 1 !== 0) {
                          return `${x.toFixed(2)}%`; // Display with two decimal points
                        } else {
                          return `${x}%`; // Display without any decimal points
                        }
                      }} //(`${x}%`)
                      style={{
                        tickLabels: { fontSize: 12, fill: colors.grey600 },
                        // axis: { stroke: "transparent" }, // Hide the axis line
                      }}
                    />
                    <VictoryScatter
                      style={{ data: { fill: "#A46AB4" }, labels: { fill: "white", fontSize: 10}}} //#c43a81
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

            <Divider />

            {/* third diagram */}
            <View>
              <View style={globalStyles.center}>  
                <Text style={styles.plotTitle}>Goal Accomplishment Distribution</Text>
              </View>
            {loading ?
                <View style={{flex: 1, justifyContent:'center'}}>
                  <ActivityIndicator size="large" color="#63086B" />
                </View>
              : (
                <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
                  <VictoryPie
                    // padAngle={({ datum }) => datum.y}
                    colorScale={pieColorScale}
                    data={pieData}
                    labels={() => ''}
                    padding={{top:10, left:20, right:20, bottom:10}}
                    style={{
                      data: {
                        stroke: colors.grey50, strokeWidth: 3
                      }
                    }}
                    // Other props for your VictoryPie component
                  />
                  <VictoryLegend
                    orientation="horizontal" // Display the legend horizontally
                    itemsPerRow={3}
                    gutter={20} // Add spacing between legend items
                    height={190}
                    style={{
                      labels: {
                        fill: colors.grey600
                      }
                    }}
                    data={pieData.map(({ x }, index) => ({
                      name: x,
                      symbol: { fill: pieColorScale[index % pieColorScale.length] }, // Use color from color scale
                    }))}
                  />
                </View>
              )}
              
            </View>  
            <View style={{height: 170}}></View>  
          </ScrollView> 

        </View>
      )
      }
    
    </View>
  )
}

export default VisualizationsScreen

const styles = StyleSheet.create({
   container: {
    // padding:10
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  plotTitle: {
    width: '90%',
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    color: 'black',
    textAlign: 'center', 
  },
  toggleContainer: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
})


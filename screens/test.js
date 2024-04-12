import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BarChart, LineChart } from 'react-native-chart-kit'
import globalStyles from '../globalStyles'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

const VisualizationsScreen = () => {
  const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 29000 }
  ];


  return (
    <View style={styles.container}>
      <VictoryChart
        // domainPadding will add space to each side of VictoryBar to
        // prevent it from overlapping the axis
        domainPadding={20}
      >
        <VictoryAxis
          // tickValues specifies both the number of ticks and where
          // they are placed on the axis
          tickValues={[1, 2, 3, 4]}
          tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
        />
        <VictoryAxis
          dependentAxis
          // tickFormat specifies how ticks should be displayed
          tickFormat={(x) => (`$${x / 1000}k`)}
        />
        <VictoryBar
          data={data}
          x="quarter"
          y="earnings"
        />
      </VictoryChart>
    </View>
  )
}

export default VisualizationsScreen

const styles = StyleSheet.create({
  body: {
    paddingTop: 50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff"
  }
})


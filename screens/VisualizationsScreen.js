import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const VisualizationsScreen = () => {
  return (
    <View style = {styles.body}>
      <Text>Vis Screen</Text>
    </View>
  )
}

export default VisualizationsScreen

const styles = StyleSheet.create({
    body: {
    paddingTop: 50,
  }
})
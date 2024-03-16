import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HomeScreen = () => {
  return (
    <View style = {styles.body}>
      <Text>Home Screen!?</Text>
      <Text>Hello from N :)</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  body: {
    paddingTop: 50,
  }
})
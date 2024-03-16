import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ChecklistScreen = () => {
  return (
    <View style = {styles.body}>
      <Text>Checklist Screen!?</Text>
    </View>
  )
}

export default ChecklistScreen

const styles = StyleSheet.create({
    body: {
    paddingTop: 50,
  }
})
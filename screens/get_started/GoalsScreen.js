import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const GoalsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.body}>
      <View style={styles.center}>
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Now that you have selected the categories, let’s make a list of goals! </Text>
      </View>

      <View style={styles.center}>
        <TouchableOpacity
          onPress={() => {/*navigation.replace('BottomNavigation');*/}}
          style={styles.button}
        >
          <Text style={styles.btnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default GoalsScreen

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#F6E8F3',
  },
  center: {
    alignItems: 'center',
  },
  title: {
    color: '#63086B',
    fontSize: 32,
  },
  subtitle: {
    width: '80%',
    marginTop: 32,
    marginBottom: 50,
    fontSize: 18,
    textAlign: 'center'
  },
  button: {
    width: '60%',
    backgroundColor: '#AA7DC6',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 20,
    fontWeight: '500',
  },
})
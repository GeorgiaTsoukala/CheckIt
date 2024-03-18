import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const IconScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.body}>
      <View style={styles.center}>
        <Text style={styles.title}>Get Started</Text>
        <Text style={styles.subtitle}>Now that you have selected the categories, let’s make a list of goals! </Text>
      </View>

      <View style={styles.center}>
        <Image source={require('../../assets/get_started_icon.png')} />
      </View>

      <View style={[styles.center, styles.btnContainer]}>
        <TouchableOpacity
          onPress={() => {navigation.navigate("Goals")}}
          style={styles.button}
        >
          <Text style={styles.btnText}>Let's go!</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default IconScreen

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
  btnContainer: {
    position: 'absolute', 
    bottom: 30, 
    width: '100%'
  },
})
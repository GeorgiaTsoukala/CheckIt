import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../globalStyles';

const IconScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={globalStyles.center}>
        <Text style={styles.title}>Check It</Text>
      </View>

      <View style={styles.center}>
        <Image source={require('../assets/get_started_icon.png')} />
      </View>
      <View style={[styles.center, styles.buttonContainer]}>
        <TouchableOpacity
         onPress={() => navigation.navigate("Login")}
         style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
         onPress={() => navigation.navigate("Register")}
         style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>   
    </View>
  )
}

export default IconScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: '#63086B',
    fontSize: 32,
    marginTop: 60,
    marginBottom: 50,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  button: {
    width: "100%",
    backgroundColor: "#aa7dc6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#aa7dc6",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "#aa7dc6",
    fontWeight: "700",
    fontSize: 15,
  },
})
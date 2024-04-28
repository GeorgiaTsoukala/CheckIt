import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import globalStyles, { colors } from '../globalStyles';
import { Button } from 'react-native-paper';

const IconScreen = () => {
  const navigation = useNavigation();

  return (    
    <ImageBackground source={require('../assets/Splash2.png')} style={styles.bckground}>
      <View style={styles.container}>
        <View style={globalStyles.center}>
          <Text style={styles.title}>Check It</Text>
        </View>
        <View style={[globalStyles.center, globalStyles.btnContainer, {bottom: 50}]} >
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate("Login")} 
            style={[globalStyles.button, {marginBottom:10}]} 
            buttonColor={colors.grey50}
          >
            <Text style={[globalStyles.btnText, {color: 'black'}]}>LOG IN</Text>
          </Button>
          <Button 
            theme={{colors: {outline: 'white'}}}
            mode="outlined" 
            onPress={() => navigation.navigate("Register")} 
            style={globalStyles.button} 
            buttonColor='black'
          >
            <Text style={globalStyles.btnText}>SIGN UP</Text>
          </Button>
        </View>              
      </View>
    </ImageBackground>
  )
}

export default IconScreen

const styles = StyleSheet.create({
  bckground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    marginTop: "10%",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 120,
    marginBottom: 50,
  },
})
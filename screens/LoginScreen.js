import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import globalStyles from '../globalStyles'

const LoginScreen = () => {
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        //the user is already registered, go to home page   
        //remove existing screens from the stack, add BottomNavigation to it and navigate there
        navigation.reset({
            index: 0,
            routes: [{ name: 'BottomNavigation' }]
        });
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior="padding"
      >
      <View style={globalStyles.center}>
        <Text style={globalStyles.title}>Welcome Back</Text>
        <Text style={globalStyles.subtitle}>Log in to your account</Text>
      </View>
      <View style={globalStyles.inputContainer}> 
        <TextInput 
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={globalStyles.input}
          >
        </TextInput>
        <TextInput 
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={globalStyles.input}
          secureTextEntry
          >
        </TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
         onPress={handleLogin}
         style={styles.button}
        >
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>        
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  }
})
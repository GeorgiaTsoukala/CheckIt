import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, datab } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const LoginScreen = () => {
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')

  // const [isRegistered, setIsRegistered] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const response = await getDoc(doc(datab, "users", auth.currentUser.uid));

        //if the user is already registered, go to home page        
        if (response?.data()?.setUp == true) {
          //replace the Login screen in the stack with BottomNavigation and navigate there
          navigation.replace("BottomNavigation"); 
        } else { //else the user needs to go through the set up process first
          //replace the Login screen in the stack with Categories and navigate there
          navigation.replace('Categories');   
        }    
      }
    });

    return unsubscribe;
  }, []);

  const handleRegister = async () => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const userInfo = {
        email: email.trim(),
        setUp: false
      };

      //create an instance at the "users" database , uid as key
      await setDoc(doc(datab, "users", response.user.uid), userInfo);
    } catch (error) {
      alert(error.message);
    }
  };

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
      <View style={styles.inputContainer}> 
        <TextInput 
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
          >
        </TextInput>
        <TextInput 
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
          >
        </TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
         onPress={handleLogin}
         style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
         onPress={handleRegister}
         style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
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
    //backgroundColor: "#267777",
  },
  // boxContainer: {
  //   justifyContent: "center",
  //   width: "80%",
  //   height: 480,
  //   borderRadius: 10,
  //   alignItems: "center",
  //   backgroundColor: "#efefef",
  // },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  button: {
    width: "100%",
    backgroundColor: "#267777",
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
    borderColor: "#267777",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "#267777",
    fontWeight: "700",
    fontSize: 15,
  },
})
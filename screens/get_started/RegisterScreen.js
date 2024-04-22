import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { doc, setDoc } from 'firebase/firestore'
import { auth, datab } from '../../firebase'
import globalStyles from '../../globalStyles'

const RegisterScreen = () => {
  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')
  const [name, setName] = useState("")

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        //the user needs to go through the set up process first  
        //remove existing screens from the stack, add Categories to it and navigate there
        navigation.reset({
            index: 0,
            routes: [{ name: 'Categories' }]
        });
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
        name: name.trim()
      };

      //create an instance at the "users" database , uid as key
      await setDoc(doc(datab, "users", response.user.uid), userInfo);
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
        <Text style={globalStyles.title}>Welcome</Text>
        <Text style={globalStyles.subtitle}>Create a new account</Text>
      </View>
      <View style={globalStyles.inputContainer}> 
        <TextInput 
          placeholder="Name"
          value={name}
          onChangeText={text => setName(text)}
          style={globalStyles.input}
          >
        </TextInput>
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
         onPress={handleRegister}
         style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

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
    borderColor: "#aa7dc6",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "#aa7dc6",
    fontWeight: "700",
    fontSize: 15,
  },
})
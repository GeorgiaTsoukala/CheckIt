import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { signOut } from 'firebase/auth';
import { auth, datab } from '../firebase';
import { MaterialIcons } from '@expo/vector-icons';
import globalStyles from '../globalStyles';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");

  useEffect(() => {
    updateScreen();
  }, []);

  const updateScreen = async () => {
    const response = await getDoc(doc(datab, "users", auth.currentUser.uid));
    if (response?.data()) {      
      //load user's name
      if (response?.data()?.name) {
        setName(response.data().name);
      }
    }
  };

  const handleSignOut = async () => {
    try {      
      await signOut(auth).then(() => {
        //remove existing screens from the stack, add LoginScreen to it and navigate there
        navigation.reset({
          index: 0,
          routes: [{ name: 'IconGetStarted' }]
        });
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={globalStyles.body}>
      <MaterialIcons
        name="logout"
        size={20}
        style={{
          alignSelf: "flex-end",
          marginTop: 25,
          marginRight: 25,
          color: "black",
        }}
        onPress={handleSignOut}
      />
      <Text>Hello {name}</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  body: {
    paddingTop: 50,
  }
})
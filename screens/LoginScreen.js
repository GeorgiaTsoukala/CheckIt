import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../globalStyles';
import { Button } from 'react-native-paper';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.innerContainer}
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
          />
          <TextInput 
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={globalStyles.input}
            secureTextEntry
          />
        </View>
        <View style={[globalStyles.btnContainer, {position:'relative', bottom: 0, marginTop:50}]}>
          <Button mode="contained" onPress={handleLogin} style={globalStyles.button} buttonColor='black'>
            <Text style={globalStyles.btnText}>LOG IN</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

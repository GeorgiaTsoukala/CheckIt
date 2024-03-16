import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ChecklistScreen from './screens/ChecklistScreen';
import VisualizationsScreen from './screens/VisualizationsScreen';
import BottomNavigation from './bottomNavigation'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen name="BottomNavigation" component={BottomNavigation}/>
        {/* <Stack.Screen name="Home" component={HomeScreen} />     
        <Stack.Screen name="Checklist" component={ChecklistScreen} /> 
        <Stack.Screen name="Visualizations" component={VisualizationsScreen} />     */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

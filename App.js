import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IconScreen from './screens/IconScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/get_started/RegisterScreen';
import CategoriesScreen from './screens/get_started/CategoriesScreen';
import GoalsScreen from './screens/get_started/GoalsScreen';
import BottomNavigation from './bottomNavigation';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="IconGetStarted" component={IconScreen}/>
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Register" component={RegisterScreen} /> 
        <Stack.Screen name="Categories" component={CategoriesScreen}/>
        <Stack.Screen name="Goals" component={GoalsScreen}/>       
        <Stack.Screen name="BottomNavigation" component={BottomNavigation}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

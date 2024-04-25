import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import ChecklistScreen from "./screens/ChecklistScreen";
import VisualizationsScreen from "./screens/VisualizationsScreen";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          marginBottom: 16,
          marginLeft: 16,
          marginRight: 16,
          // elevation: 0,
          borderRadius: 15,
          // backgroundColor: "gainsboro",
          height: 60,
          ...styles.mybackground,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View>
              <FontAwesome
                name="home"
                size={24}
                style={{
                  alignSelf: "center",
                  color: focused ? "red" : "black",
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  color: focused ? "red" : "black",
                }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Checklist"
        component={ChecklistScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialIcons
                name="checklist"
                size={24}
                style={{
                  alignSelf: "center",
                  color: focused ? "red" : "black",
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  color: focused ? "red" : "black",
                }}
              >
                Checklist
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Visualizations"
        component={VisualizationsScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialIcons
                name="auto-graph"
                size={24}
                style={{
                  alignSelf: "center",
                  color: focused ? "red" : "black",
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  color: focused ? "red" : "black",
                }}
              >
                Reflection
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  mybackground: {
    backgroundColor: 'white',
  }
})
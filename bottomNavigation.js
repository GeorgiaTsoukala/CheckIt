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
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
          elevation: 0,
          borderRadius: 15,
          backgroundColor: "gainsboro",
          height: 60,
        //   ...styles.shadow,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
        //   headerStyle: {
        //     backgroundColor: "#267777", //"#206464"
        //   },
        //   headerTitleStyle: {
        //     color: "white",
        //   },
          tabBarIcon: ({ focused }) => (
            <View>
              <FontAwesome
                name="home"
                size={24}
                style={{
                  alignSelf: "center",
                  color: focused ? "#267777" : "black",
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  color: focused ? "#267777" : "black",
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
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialIcons
                name="checklist"
                size={24}
                style={{
                  alignSelf: "center",
                  color: focused ? "#267777" : "black",
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  color: focused ? "#267777" : "black",
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
          tabBarIcon: ({ focused }) => (
            <View>
              <MaterialIcons
                name="auto-graph"
                size={focused ? 30 : 24}
                style={{
                  alignSelf: "center",
                  color: focused ? "#267777" : "black",
                }}
              />
              <Text
                style={{
                    fontWeight: focused ? '700' : '500',
                  alignSelf: "center",
                  color: focused ? "#267777" : "black",
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
import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserProfileScreen from "../UserProfileScreen";
import ScheduleScreen from "../ScheduleScreen";
import PlannerScreen from "../PlannerScreen";

import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
// import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack"; // Import createStackNavigator

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Create a Stack navigator
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

// Stack navigator for AddPost screens

export default function TabNavigation() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="schedule"
        component={ScheduleScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, marginBottom: 3, fontSize: 12 }}>
              schedule
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="planner"
        component={PlannerScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, marginBottom: 3, fontSize: 12 }}>
              planner
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="layout" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={UserProfileScreen} // Use the AddPostStack as component
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, marginBottom: 3, fontSize: 12 }}>
              profile
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-alt" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

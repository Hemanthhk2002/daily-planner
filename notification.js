import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PORT_URL from "./ip";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
});

const [expoPushToken, setExpoPushToken] = useState("");

useEffect(() => {
    console.log("Registering for push notifications...");
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("token: ", token);
        setExpoPushToken(token);
      })
      .catch((err) => console.log(err));
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "9b313f5b-aab4-438b-89ff-b704955496f8",
        })
      ).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }
    return token;
  }

export const scheduleReminder = async (email) => {
    // Function implementation
    const data = {
        email: email,
      }
  
      const response = await axios.post(PORT_URL + "/reminder", data);
      const sortedEvents = response.data.data;
  
      sortedEvents.forEach(async (event, index) =>  {
        const dateString = event.date;
        const dateParts = dateString.split("-");
  
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]);
        const day = parseInt(dateParts[2]);
  
        const timeString = event.time;
        const timeParts = timeString.split(":");
  
        // Convert the parts to integers
        let hours = parseInt(timeParts[0]);
        let minutes = parseInt(timeParts[1]);
  
        // Convert to 24-hour format if necessary
        if (hours < 12 && timeString.includes("PM")) {
            hours += 12;
        }
  
        const notificationDate = new Date(year, month-1, day, hours, minutes);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: event.name,
            body: "This notification was scheduled to be sent at a specific time.",
          },
          trigger: {
            date: notificationDate,
          },
        });
      });
      
      const notificationDate = new Date(2024, 4, 4, 7, 26);
  
      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Scheduled Notification",
          body: "This notification was scheduled to be sent at a specific time.",
        },
        trigger: {
          date: notificationDate,
        },
      });
  
      console.log("Notification scheduled successfully!");
};
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    // console.log("Registering for push notifications...");
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
        console.error("Failed to get push token for push notification!");
        return;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "9b313f5b-aab4-438b-89ff-b704955496f8",
        })
      ).data;
      // console.log(token);
    } else {
      console.error("Must use physical device for Push Notifications");
    }
    return token;
  }

  const scheduleReminder = async (id, name, description, date, time) => {
    const dateString = date;
    const dateParts = dateString.split("-");

    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    const timeString = time;
    const timeParts = timeString.split(":");

    // Convert the parts to integers
    let hours = parseInt(timeParts[0]);
    let minutes = parseInt(timeParts[1]);

    // Convert to 24-hour format if necessary
    if (hours < 12 && timeString.includes("PM")) {
      hours += 12;
    }

    // console.log("id = ");
    // console.log(id);

    const notificationDate = new Date(year, month - 1, day, hours, minutes);
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        to: expoPushToken,
        sound: "default",
        title: name,
        body: description,
      },
      trigger: {
        date: notificationDate,
      },
    });
    // console.log("Notification scheduled successfully!");
  };

  const cancelScheduledNotification = async (notificationIdentifier) => {
    // console.log("ID = " + notificationIdentifier);
    await Notifications.cancelScheduledNotificationAsync(
      notificationIdentifier
    );
    // console.log("Notification cancelled successfully!");
  };

  return { expoPushToken, scheduleReminder, cancelScheduledNotification };
};

export default usePushNotifications;

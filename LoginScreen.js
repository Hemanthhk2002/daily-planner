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

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setemail] = useState();
  const [password, setPassword] = useState();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token);
      })
      .catch((err) => console.log(err));
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 3;
  };

  const handleValidation = () => {
    if (!validateEmail(email)) {
      setEmailError("Enter the valid Email");
      return false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("password not match");
      return false;
    } else {
      setPasswordError("");
    }

    return true;
  };

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
      // console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }
    return token;
  }

  const scheduleReminder = async (email) => {
    const data = {
      email: email,
    };

    const response = await axios.post(PORT_URL + "/reminder", data);
    const sortedEvents = response.data.data;

    sortedEvents.forEach(async (event, index) => {
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

      const notificationDate = new Date(year, month - 1, day, hours, minutes);
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

    // console.log("Notification scheduled successfully!");
  };

  const handleLogin = async () => {
    if (handleValidation()) {
      // You may want to adjust this condition based on your app's logic
      const userdata = {
        email: email,
        pswd: password,
      };

      try {
        const response = await axios.post(PORT_URL + "/user-login", userdata);
        // console.log(response.data.message);

        if (response.data.message === "User loggedin") {
          const userDataFromServer = response.data;
          // console.log("Login Console", userDataFromServer);
          // Store user data in AsyncStorage
          await AsyncStorage.setItem(
            "data",
            JSON.stringify(userDataFromServer.data)
          )
            .then(() => {
              // console.log("Email stored successfully");
            })
            .catch((error) => {
              console.log("Error storing email: ", error);
            });
          await AsyncStorage.setItem("token", userDataFromServer.token);
          await scheduleReminder(userDataFromServer.email);
          navigation.navigate("TabNavigation");
        } else {
          // Handle unsuccessful login
          console.log("Login failed: ", response.data.message);
        }
      } catch (error) {
        console.log("Error logging in: ", error);
      }
    }
  };

  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.semiCircle} />
      <Image
        source={require("./assets/images/calendar.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.logo}>Welcome Back</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          onChangeText={(text) => setemail(text)}
          value={email}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      <View>
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      <View>
        {passwordError ? (
          <Text style={styles.error}>{passwordError}</Text>
        ) : null}
      </View>
      {/* <View style={styles.checkboxContainer}>
        <TouchableOpacity
          onPress={() => setRememberMe(!rememberMe)}
          style={styles.checkbox}
        >
          {rememberMe && <View style={styles.checked} />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Remember Me</Text>
      </View> */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignup}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  semiCircle: {
    width: windowWidth + 100,
    height: windowWidth / 1.4,
    backgroundColor: "#97E7E1",
    borderBottomLeftRadius: windowWidth,
    borderBottomRightRadius: windowWidth,
    position: "absolute",
    top: 0,
    zIndex: -1,
  },
  logo: {
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 40,
    color: "#000000",
    // fontFamily: "BreeSherifRegular",
    marginTop: 180,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#B3C8CF",
    borderRadius: 10,
    height: 50,
    marginBottom: 10,
    justifyContent: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ffffff", // Set borderColor to match background color
  },
  inputText: {
    height: 50,
    color: "#000000", // Set text color
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#97E7E1",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#97E7E1",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    width: 14,
    height: 14,
    backgroundColor: "#97E7E1",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  signupText: {
    marginTop: 5,
    color: "#97E7E1",
  },
  image: {
    width: 250,
    height: 250,
    position: "absolute",
    top: 25,
    alignSelf: "center",
  },
  error: {
    color: "red",
    marginTop: -8,
    marginBottom: 10,
    marginLeft: -130,
  },
});

export default LoginScreen;

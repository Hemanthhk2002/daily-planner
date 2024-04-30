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
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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

  const scheduleReminder = async () => {
    console.log("Scheduling push notification...");
    const notificationDate = new Date(2024, 3, 28, 12, 39);

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


  const handleLogin = async () => {
    if (true) {
      const data = {
        email: email,
        pswd: password,
      };

      try {
        const response = await axios
        .post(PORT_URL + "/user-login", data);
        console.log(response.data.message);
        if(response.data.message == "User loggedin"){
          await scheduleReminder();
          //console.log("data");
          AsyncStorage.setItem("data", JSON.stringify(response.data.data));
          //console.log(data);
          navigation.navigate("TabNavigation");
        }
      } catch (error) {
        console.log(error);
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
        source={require('./assets/images/calendar.png')}
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
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          onPress={() => setRememberMe(!rememberMe)}
          style={styles.checkbox}
        >
          {rememberMe && <View style={styles.checked} />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Remember Me</Text>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignup}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  semiCircle: {
    width: windowWidth+100,
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
    marginBottom: 20,
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
});

export default LoginScreen;

import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PORT_URL from "./ip";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function handleSignup() {
    if (!username || !email || !password || !newPassword) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return false;
    }
    if (password != newPassword) {
      Alert.alert("Validation Error", "Reenter your password correctly");
      setPassword("");
      setNewPassword("");
      return false;
    }
    return true;
  }

  const handleSignIn = () => {
    navigation.navigate("Login");
  };

  const handleSubmit = async () => {
    if (handleSignup()) {
      const data = {
        email: email,
        name: username,
        pswd: password,
      };

      // console.log(data);

      try {
        const response = await axios.post(PORT_URL + "/register", data);
        // console.log("Response data:", response.data);
        if (response.data.data == "User created") {
          navigation.navigate("TabNavigation");
        } else {
          navigation.navigate("Signup");
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log(
            "Server responded with non-2xx status code:",
            error.response.status
          );
          console.log("Response data:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log("No response received from server.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error setting up the request:", error.message);
        }
        console.log("Error config:", error.config);
      }
    }
  };

  return (
    <ImageBackground
      source={require("./assets/images/teamwork.png")}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.logo}>Register</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Username"
            onChangeText={(text) => setUsername(text)}
            value={username}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="New Password"
            secureTextEntry={true}
            onChangeText={(text) => setNewPassword(text)}
            value={newPassword}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
          <Text style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={styles.signInText}>
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Adjust the opacity as needed
    width: "100%",
    padding: 20,
    borderRadius: 10,
  },
  logo: {
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 20,
    color: "#000000",
    textAlign: "center",
    paddingTop: 50,
  },
  inputView: {
    width: "100%",
    backgroundColor: "#B3C8CF",
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#97E7E1",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
  },
  signInText: {
    marginTop: 10,
    color: "#000000",
    textAlign: "center",
  },
});

export default SignupScreen;

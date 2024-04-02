import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

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
  // Your signup logic goes here

  // After successful signup, navigate to UserProfileScreen
  // navigation.navigate("Profile");

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

      console.log(data);

      try {
        const response = await axios.post(
          "http://192.168.1.97:3000/register",
          data
        );
        console.log("Response data:", response.data);
        navigation.navigate("Login");
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
    <View style={styles.container}>
      <Text style={styles.logo}>Personal Planner</Text>
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
        <Text style={styles.signInText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDFCF4",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 40,
    color: "#94C973",
  },
  inputView: {
    width: "80%",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#94C973",
    borderRadius: 25,
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
    color: "#94C973",
  },
});

export default SignupScreen;

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
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = () => {
    let valid = true;

    // Reset errors
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setNewPasswordError("");

    if (!username) {
      setUsernameError("Username is required");
      valid = false;
    }

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }

    if (!newPassword) {
      setNewPasswordError("New Password is required");
      valid = false;
    } else if (password !== newPassword) {
      setNewPasswordError("Passwords do not match");
      valid = false;
      setPassword("");
      setNewPassword("");
    }

    return valid;
  };

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

      try {
        const response = await axios.post(PORT_URL + "/register", data);
        if (response.data.data === "User created") {
          navigation.navigate("TabNavigation");
        } else {
          navigation.navigate("Signup");
        }
      } catch (error) {
        if (error.response) {
          console.log(
            "Server responded with non-2xx status code:",
            error.response.status
          );
          console.log("Response data:", error.response.data);
        } else if (error.request) {
          console.log("No response received from server.");
        } else {
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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            placeholder="Username"
            onChangeText={(text) => setUsername(text)}
            value={username}
          />
          {usernameError ? (
            <Text style={styles.error}>{usernameError}</Text>
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            keyboardType="email-address"
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            placeholder="New Password"
            secureTextEntry={true}
            onChangeText={(text) => setNewPassword(text)}
            value={newPassword}
          />
          {newPasswordError ? (
            <Text style={styles.error}>{newPasswordError}</Text>
          ) : null}
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputText: {
    height: 50,
    backgroundColor: "#B3C8CF",
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    marginLeft: 20,
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

import React, { useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import TabNavigation from "./Navigation/TabNavigation";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (true) {
      const data = {
        email: email,
        pswd: password,
      };

      // console.log(data);

      try {
        const response = await axios
          .post("http://192.168.180.191:3000/user-login", data)
          .then((res) => {
            // console.log("loginned data", res.data);
            AsyncStorage.setItem("data", JSON.stringify(res.data));
          });
        // console.log(response.data);
        // <UserProfileScreen data={response.data} />

        navigation.navigate("TabNavigation");
      } catch (error) {
        console.log(error);
      }
    }
  };

  // const handleLogin = () => {
  //   if (!username || !password) {
  //     Alert.alert(
  //       "Validation Error",
  //       "Please enter both username and password"
  //     );
  //     return;
  //   }
  //   // Your login logic goes here

  //   // After successful login, navigate to UserProfileScreen
  //   navigation.navigate("TabNavigation");
  // };

  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Personal Planner</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          onChangeText={(text) => setemail(text)}
          value={email}
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#94C973",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    width: 14,
    height: 14,
    backgroundColor: "#94C973",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  signupText: {
    marginTop: 10,
    color: "#94C973",
  },
});

export default LoginScreen;

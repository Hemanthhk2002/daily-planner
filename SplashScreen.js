import { View, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      // Check if user is already authenticated
      const userToken = await AsyncStorage.getItem("token");
      // If userToken exists, navigate to main part of application
      if (userToken) {
        navigation.navigate("TabNavigation");
      } else {
        // If userToken doesn't exist, show login screen
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/catloader.gif")}
        style={styles.image}
        resizeMode="contain" // or any other resizeMode option
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#97E7E1",
  },
  image: {
    width: 150,
    height: 150,
  },
});

export default SplashScreen;

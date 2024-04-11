import {
  View,
  StyleSheet,
  Image,
} from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
        <Image
            source={require('./assets/catloader.gif')}
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

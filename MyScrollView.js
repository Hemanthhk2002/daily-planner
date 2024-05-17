import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  Image,
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const imageWidth = screenWidth - 40; // Adjust as needed

const MyScrollView = () => {
  const images = [
    require("./images/image1.png"),
    require("./images/image2.jpeg"),
    require("./images/image3.jpeg"),
    require("./images/image1.png"),
    require("./images/image2.jpeg"),
    require("./images/image3.jpeg"),
  ]; // Replace with your image sources

  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        pan.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 50) {
          const newIndex =
            gestureState.dx > 0
              ? currentIndex === 0
                ? images.length - 1
                : currentIndex - 1
              : (currentIndex + 1) % images.length;
          setCurrentIndex(newIndex);
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 30000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.spring(pan, {
      toValue: -currentIndex * screenWidth,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback {...panResponder.panHandlers}>
        <Animated.View
          style={[styles.scrollView, { transform: [{ translateX: pan }] }]}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={image} style={styles.image} resizeMode="cover" />
            </View>
          ))}
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },

  scrollView: {
    flexDirection: "row",
    width: screenWidth * 3, // Ensure enough space for all images
  },
  imageContainer: {
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 150, // Adjust height as needed
    borderRadius: 10,
    marginRight: 20, // Optional: Add border radius
  },
});

export default MyScrollView;

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Animated,
  Modal,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import PORT_URL from "../ip";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Create({ visible, setCreateModalVisible, onCallback }) {
  // console.log("testing....", setCreateModalVisible);
  const [selectedColor, setSelectedColor] = useState("");
  const [title, setTitle] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [showModal, setShowModal] = useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  // console.log("ert" + visible);

  React.useEffect(() => {
    toggleModal();
  }, [visible]);

  React.useEffect(() => {
    // setShowModal(visible);
    setCreateModalVisible(visible);
  }, [visible]);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const colors = [
    "#FF5733", // Red
    "#FFD700", // Gold
    "#5D76A9",
    "#1877F2", // Medium Purple
    "#32CD32", // Lime Green
    "#CCCCFF", // Tomato
    "#4169E1", // Royal Blue
  ];
  const days = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
  const [repeatMode, setRepeatMode] = useState("daily");

  async function addHabit() {
    try {
      const habitDetails = {
        title: title,
        color: selectedColor,
        repeatMode: repeatMode,
        reminder: true,
        days: selectedDays,
      };
      console.log(habitDetails);

      const headers = {
        token: await AsyncStorage.getItem("token"),
        "Content-Type": "application/json",
      };

      const response = await axios.post(`${PORT_URL}/habits`, habitDetails, {
        headers,
      });
      console.log("log file.....", response);

      setCreateModalVisible(false);

      if (response.status === 200) {
        setTitle("");
        setSelectedDays([]);
        Alert.alert("Habit added successfully", "Enjoy Practising");
        onCallback(habitDetails);
      }

      // console.log("habit added", response);
    } catch (error) {
      // console.log("error adding a habit", error);
      console.log("Error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        console.log("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error setting up request:", error.message);
      }
    }
  }

  const toggleDaySelection = (day) => {
    const isSelected = selectedDays.includes(day);
    if (isSelected) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // const onBackPress = () => {
  //   setShowModal(false);
  // };

  return (
    <Modal visible={visible} onRequestClose={setCreateModalVisible}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ padding: 10 }}>
              <Pressable onPress={() => setCreateModalVisible(false)}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </Pressable>

              <Text style={{ fontSize: 20, marginTop: 10 }}>
                Create{" "}
                <Text style={{ fontSize: 20, fontWeight: "500" }}>Habit</Text>
              </Text>
              <TextInput
                value={title}
                onChangeText={(text) => setTitle(text)}
                style={{
                  width: "95%",
                  marginTop: 15,
                  padding: 15,
                  borderRadius: 10,
                  backgroundColor: "#aace93",
                }}
                placeholder="Title"
              />

              <View style={{ marginVertical: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "500" }}>Color</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  {colors?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => setSelectedColor(item)}
                      key={index}
                      activeOpacity={0.8}
                    >
                      {selectedColor === item ? (
                        <AntDesign name="plussquare" size={30} color={item} />
                      ) : (
                        <FontAwesome name="square" size={30} color={item} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={{ fontSize: 18, fontWeight: "500" }}>Repeat</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginVertical: 10,
                }}
              >
                <Pressable
                  onPress={() => setRepeatMode("daily")}
                  style={{
                    backgroundColor:
                      repeatMode === "daily" ? "#AFDBF5" : "#FFFFFF",
                    padding: 10,
                    borderRadius: 6,
                    flex: 1,
                  }}
                >
                  <Text style={{ textAlign: "center" }}>Daily</Text>
                </Pressable>
                <Pressable
                  onPress={() => setRepeatMode("weekly")}
                  style={{
                    backgroundColor:
                      repeatMode === "weekly" ? "#AFDBF5" : "#FFFFFF",
                    padding: 10,
                    borderRadius: 6,
                    flex: 1,
                  }}
                >
                  <Text style={{ textAlign: "center" }}>Weekly</Text>
                </Pressable>
              </View>

              <Text style={{ fontSize: 18, fontWeight: "500" }}>
                On these days
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                {days?.map((item, index) => (
                  <Pressable
                    key={index}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 5,
                      backgroundColor: selectedDays.includes(item)
                        ? "#00428c"
                        : "#E0E0E0",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => toggleDaySelection(item)}
                  >
                    <Text
                      style={{
                        color: selectedDays.includes(item) ? "white" : "black",
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 17, fontWeight: "500" }}>
                  Reminder
                </Text>
                <Text
                  style={{ fontSize: 17, fontWeight: "500", color: "#2774AE" }}
                >
                  Yes
                </Text>
              </View>

              <Pressable
                onPress={addHabit}
                style={{
                  marginTop: 25,
                  backgroundColor: "#00428c",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  SAVE
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

//const styles = StyleSheet.create({});
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  backIcon: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginTop: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#aace93",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 10,
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "black",
  },
  selectedColor: {
    borderWidth: 2,
  },
  saveButton: {
    marginTop: 25,
    backgroundColor: "#00428c",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Pressable,
    Animated,
    Modal,
    Alert,
  } from "react-native";
  import React, { useState } from "react";
  import { Ionicons, AntDesign } from "@expo/vector-icons";
  import { FontAwesome } from "@expo/vector-icons";
  import axios from "axios";
  
  const create = ({ visible, children }) => {
    const [selectedColor, setSelectedColor] = useState("");
    const [title, setTitle] = useState("");
    const [showModal, setShowModal] = React.useState(visible);
    const scaleValue = React.useRef(new Animated.Value(0)).current;

    console.log(visible);

    React.useEffect(() => {
        toggleModal();
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
    async function addHabit() {
      try {
        const habitDetails = {
          title: title,
          color: selectedColor,
          repeatMode: "daily",
          reminder: true,
        };
  
        const response = await axios.post(
          "http://localhost:3000/habits",
          habitDetails
        );
  
        if (response.status === 200) {
          setTitle("");
          Alert.alert("Habit added succesfully", "Enjoy Practising");
        }
  
        console.log("habit added", response);
      } catch (error) {
        console.log("error adding a habit", error);
      }
    }

    const onBackPress= () => {
        setShowModal(false);
    }

    return (
      <Modal transparent visible={showModal}>
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Pressable onPress={onBackPress} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>

  
            <Text style={{ fontSize: 20, marginTop: 10 }}>
                Create <Text style={{ fontSize: 20, fontWeight: "500" }}>Habit</Text>
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
                style={{
                    backgroundColor: "#AFDBF5",
                    padding: 10,
                    borderRadius: 6,
                    flex: 1,
                }}
                >
                <Text style={{ textAlign: "center" }}>Daily</Text>
                </Pressable>
                <Pressable
                style={{
                    backgroundColor: "#AFDBF5",
                    padding: 10,
                    borderRadius: 6,
                    flex: 1,
                }}
                >
                <Text style={{ textAlign: "center" }}>Weekly</Text>
                </Pressable>
            </View>

            <Text style={{ fontSize: 18, fontWeight: "500" }}>On these days</Text>

            <View
                style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginTop: 10,
                }}
            >
                {days?.map((item, index) => (
                <Pressable
                    style={{
                    width: 30,
                    height: 30,
                    borderRadius: 5,
                    backgroundColor: "#E0E0E0",
                    justifyContent: "center",
                    alignItems: "center",
                    }}
                >
                    <Text>{item}</Text>
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
                <Text style={{ fontSize: 17, fontWeight: "500" }}>Reminder</Text>
                <Text style={{ fontSize: 17, fontWeight: "500", color: "#2774AE" }}>
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
                style={{ textAlign: "center", color: "white", fontWeight: "bold" }}
                >
                SAVE
                </Text>
            </Pressable>
            </View>
        </View>
      </Modal>
    );
  };
  
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

  export default create;
  
  //const styles = StyleSheet.create({});
  
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Ionicons, Feather, EvilIcons, FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import PORT_URL from "./ip";
import {
  BottomModal,
  ModalTitle,
  SlideAnimation,
  ModalContent,
  ModalPortal,
} from "react-native-modals";
import { useFocusEffect } from "@react-navigation/native";
import Create from "./components/Create";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PlannerScreen = () => {
  const [option, setOption] = useState("Today");
  //const router = useRouter();
  const [habits, setHabits] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState();
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

  const currentDay = new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .slice(0, 3);
  // console.log(currentDay);
  useEffect(() => {
    fetchHabits();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, [])
  );

  const fetchHabits = async () => {
    try {
      const headers = {
        token: await AsyncStorage.getItem("token"),
        "Content-Type": "application/json",
      };
      // console.log(headers);
      const response = await axios.get(PORT_URL + "/habitslist", { headers });
      setHabits(response.data);
    } catch (error) {
      console.log("error fetching habits", error);
    }
  };
  const handleLongPress = (habitId) => {
    const selectedHabit = habits?.find((habit) => habit._id == habitId);
    setSelectedHabit(selectedHabit);
    setModalVisible(true);
  };

  const handleCompletion = async () => {
    try {
      const habitId = selectedHabit?._id;
      const updatedCompletion = {
        ...selectedHabit?.completed,
        [currentDay]: true,
      };

      const headers = {
        token: await AsyncStorage.getItem("token"),
        "Content-Type": "application/json",
      };

      let response = await axios.put(
        `${PORT_URL}/habits/${habitId}/completed`,
        {
          completed: updatedCompletion,
        },
        { headers }
      );

      if (response.status == 200) {
        console.log("Planner completed : " + JSON.stringify(response.data));
      } else {
        console.log("Planner completed : " + response.error);
      }

      await fetchHabits();

      setModalVisible(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const filteredHabits = habits
    ? habits.filter((habit) => {
        return !habit.completed || !habit.completed[currentDay];
      })
    : [];

  // console.log("filtered habbits", habits);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const deleteHabit = async () => {
    try {
      const habitId = selectedHabit._id;
      const headers = {
        token: await AsyncStorage.getItem("token"),
        "Content-Type": "application/json",
      };

      const response = await axios.delete(`${PORT_URL}/habits/${habitId}`, {
        headers,
      });

      if (response.status == 200) {
        // await fetchHabits();
        setHabits((preHabits) => preHabits.filter((h) => h._id != habitId));
        // setHabits(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const getCompletedDays = (completedObj) => {
    if (completedObj && typeof completedObj === "object") {
      return Object.keys(completedObj).filter((day) => completedObj[day]);
    }

    return [];
  };

  // const closeCreateModal = () => {

  // };

  // Function to open create habit modal
  const openCreateModal = () => {
    setCreateModalVisible(true);
  };

  const addHabit = (habit) => {
    setHabits((preHabits) => {
      return [...preHabits, habit];
    });
  };

  return (
    <>
      {/* <Create visible={isCreateModalVisible} onClose={closeCreateModal}/> */}
      <Create
        visible={isCreateModalVisible}
        // onClose={() => setCreateModalVisible(false)}
        onModalClose={fetchHabits}
        setCreateModalVisible={setCreateModalVisible}
        onCallback={(newHabit) => addHabit(newHabit)}
      />
      <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 50,
            marginBottom: 20,
            // padding: 20,
          }}
        >
          {/* <Ionicons name="logo-foursquare" size={27} color="black" /> */}
          <Text style={{ marginTop: 5, fontSize: 23, fontWeight: "500" }}>
            Habits
          </Text>

          <AntDesign
            onPress={openCreateModal}
            name="plus"
            size={24}
            color="black"
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginVertical: 8,
          }}
        >
          <Pressable
            onPress={() => setOption("Today")}
            style={{
              backgroundColor: option == "Today" ? "#E0FFFF" : "transparent",
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 25,
            }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 14 }}>
              Today
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setOption("Weekly")}
            style={{
              backgroundColor: option == "Weekly" ? "#E0FFFF" : "transparent",
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 25,
            }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 14 }}>
              Weekly
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setOption("Overall")}
            style={{
              backgroundColor: option == "Overall" ? "#E0FFFF" : "transparent",
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 25,
            }}
          >
            <Text style={{ textAlign: "center", color: "gray", fontSize: 14 }}>
              Overall
            </Text>
          </Pressable>
        </View>

        {option == "Today" &&
          (filteredHabits?.length > 0 ? (
            <ScrollView>
              <View>
                {filteredHabits?.map((item, index) => (
                  <Pressable
                    key={index}
                    onLongPress={() => handleLongPress(item._id)}
                    style={{
                      margin: 10,
                      backgroundColor: item?.color,
                      padding: 12,
                      borderRadius: 15,
                      paddingVertical: 15,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "500",
                        color: "white",
                      }}
                    >
                      {item?.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View
              style={{
                marginTop: 150,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "auto",
              }}
            >
              <Image
                style={{ width: 60, height: 60, resizeMode: "cover" }}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/10609/10609386.png",
                }}
              />

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "600",
                  marginTop: 10,
                }}
              >
                No habits for today
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "600",
                  marginTop: 10,
                }}
              >
                No habits for today.Create one?
              </Text>

              <Pressable
                onPress={openCreateModal}
                style={{
                  backgroundColor: "#0071c5",
                  marginTop: 20,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Text>Create</Text>
              </Pressable>
            </View>
          ))}

        {option == "Weekly" && (
          <ScrollView>
            <View>
              {habits?.map((habit, index) => (
                <Pressable
                  key={index}
                  style={{
                    marginVertical: 10,
                    backgroundColor: habit.color,
                    padding: 15,
                    borderRadius: 24,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "500",
                        color: "white",
                      }}
                    >
                      {habit.title}
                    </Text>
                    <Text style={{ color: "white" }}>{habit.repeatMode}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      marginVertical: 10,
                    }}
                  >
                    {days?.map((day, item) => {
                      const isCompleted =
                        habit.completed && habit.completed[day];

                      return (
                        <Pressable key={item}>
                          <Text
                            style={{
                              color: day === currentDay ? "red" : "white",
                            }}
                          >
                            {day}
                          </Text>
                          {isCompleted ? (
                            <FontAwesome
                              name="circle"
                              size={24}
                              color="white"
                              style={{ marginTop: 12 }}
                            />
                          ) : (
                            <Feather
                              name="circle"
                              size={24}
                              color="white"
                              style={{ marginTop: 12 }}
                            />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}

        {option === "Overall" && (
          <ScrollView>
            <View>
              {habits?.map((habit, index) => (
                <View key={index}>
                  <Pressable
                    style={{
                      marginVertical: 10,
                      backgroundColor: habit.color,
                      padding: 15,
                      borderRadius: 24,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          color: "white",
                        }}
                      >
                        {habit.title}
                      </Text>
                      <Text style={{ color: "white" }}>{habit.repeatMode}</Text>
                    </View>
                  </Pressable>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>Completed On</Text>
                    <Text>{getCompletedDays(habit.completed).join(", ")}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <BottomModal
        onBackdropPress={() => setModalVisible(!isModalVisible)}
        onHardwareBackPress={() => setModalVisible(!isModalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalTitle={<ModalTitle title="Choose Option" />}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        visible={isModalVisible}
        onTouchOutside={() => setModalVisible(!isModalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 280 }}>
          <View style={{ marginVertical: 10 }}>
            <Text>Options</Text>
            <Pressable
              onPress={handleCompletion}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginTop: 10,
              }}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="black"
              />
              <Text>Completed</Text>
            </Pressable>
            {/* <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginTop: 10,
              }}
            >
              <Feather name="skip-forward" size={24} color="black" />
              <Text>Skip</Text>
            </Pressable> */}
            {/* <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginTop: 12,
              }}
            >
              <Feather name="edit-2" size={24} color="black" />
              <Text>Edit</Text>
            </Pressable> */}
            {/* <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginTop: 12,
              }}
            >
              <EvilIcons name="archive" size={24} color="black" />
              <Text>Archive</Text>
            </Pressable> */}

            <Pressable
              onPress={deleteHabit}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginTop: 12,
              }}
            >
              <AntDesign name="delete" size={24} color="black" />
              <Text>Delete</Text>
            </Pressable>
          </View>
        </ModalContent>
      </BottomModal>
      <ModalPortal />
    </>
  );
};

const styles = StyleSheet.create({});

export default PlannerScreen;

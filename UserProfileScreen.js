import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import { Avatar, Badge } from "@react-native-material/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import PORT_URL from "./ip";
import MyScrollView from "./MyScrollView"; // Import the MyScrollView component
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/core";

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [habitPendingCount, setHabitPendingCount] = useState(0);
  const [habitCompletedCount, setHabitCompletedCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pendingTasks, setPendingTasks] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [completedTasks, setCompletedTasks] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [taskCount, setTaskCount] = useState([]);
  const [labels, setLabels] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchData();
      fetchHabitCount();
      fetchHabits();
      generateLabels();
    }
  }, [isFocused]);

  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem("data");
      console.log(JSON.stringify(data));
      if (data) {
        const parsedData = JSON.parse(data);
        setUserName(parsedData.name);
      }
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
    }
  };

  const fetchHabits = async () => {
    const today = new Date();
    const pastWeekDates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      pastWeekDates.push(date.toISOString().split("T")[0]);
    }

    try {
      const headers = {
        token: await AsyncStorage.getItem("token"),
        "Content-Type": "application/json",
      };
      const response = await axios.get(PORT_URL + "/getHabits", { headers });
      const allStatus = response.data.allStatus;
      const taskCounts = countTasksByDate(allStatus, pastWeekDates);
      setTaskCount(taskCounts);
    } catch (error) {
      console.log("error " + error);
    }
  };

  useEffect(() => {
    const completedArray = new Array(7).fill(0);
    const pendingArray = new Array(7).fill(0);

    taskCount.forEach((task, index) => {
      completedArray[index] = task.completed;
      pendingArray[index] = task.pending;
    });

    setCompletedTasks(completedArray);
    setPendingTasks(pendingArray);
    console.log(pendingArray);
    console.log(completedArray);
  }, [taskCount]);

  const countTasksByDate = (statuses, dates) => {
    const taskCounts = dates.map((date) => ({
      date,
      completed: 0,
      pending: 0,
    }));

    statuses.forEach((status) => {
      const date = status.createdAt.split("T")[0];
      const taskCount = taskCounts.find((task) => task.date === date);

      if (taskCount) {
        if (status.status === "completed") {
          taskCount.completed++;
        } else if (status.status === "pending") {
          taskCount.pending++;
        }
      }
    });

    return taskCounts;
  };

  const generateLabels = () => {
    const today = new Date();
    const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const pastWeekLabels = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      pastWeekLabels.push(weekDayNames[date.getDay()]);
    }

    setLabels(pastWeekLabels);
    console.log(labels);
  };

  const fetchHabitCount = async () => {
    try {
      const headers = {
        token: await AsyncStorage.getItem("token"),
        "Content-Type": "application/json",
      };
      const response = await axios.get(PORT_URL + "/getStatus", { headers });
      setHabitPendingCount(response.data.pendingHabitsCount);
      setHabitCompletedCount(response.data.completedHabitsCount);
    } catch (error) {
      console.log("error fetching habits", error);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem("data");
      await AsyncStorage.removeItem("token");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (error) {
      console.error("Error logging out:", error);
    }
    setShowLogoutModal(false);
  };
  const handleCompletedTasksPress = () => {
    // Handle completed tasks press
    navigation.navigate("planner");
    // Navigate to Completed Tasks screen or perform any other action
  };

  const handlePendingTasksPress = () => {
    // Handle pending tasks press
    navigation.navigate("planner");
    // Navigate to Pending Tasks screen or perform any other action
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.userview}>
          <Avatar label={userName} autoColor size={50} />
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginLeft: 25,
            }}
            variant="h6"
          >
            {userName}
          </Text>
        </View>

        {/* <View style={styles.streaks}>
          <Text variant="h6">Streaks</Text>
          <View style={styles.count}>
            <Text variant="h6">🔥</Text>
            <Badge style={styles.incr} label={123} color="primary" />
          </View>
        </View> */}

        <Text
          style={{
            alignSelf: "flex-start",
            marginLeft: 10,
            marginVertical: 15,
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          Tasks Overview
        </Text>

        <View style={{ flexDirection: "row", gap: 20 }}>
          <TouchableOpacity
            style={styles.ctasks}
            onPress={handleCompletedTasksPress}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }} variant="h6">
              {habitCompletedCount}
            </Text>
            <Text style={{ fontSize: 18, marginTop: 10 }} variant="h6">
              Completed Tasks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctasks}
            onPress={handlePendingTasksPress}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }} variant="h6">
              {habitPendingCount}
            </Text>
            <Text style={{ fontSize: 18, marginTop: 10 }} variant="h6">
              Pending Tasks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Include the MyScrollView component */}
        <Text
          style={{
            alignSelf: "flex-start",
            marginLeft: 10,
            marginVertical: 15,
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          Habit Trends
        </Text>

        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: pendingTasks,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: completedTasks,
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={Dimensions.get("window").width - 20}
          height={220}
          yAxisInterval={2}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c88",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            borderRadius: 16,
            marginTop: 8,
            shadowOffset: {
              width: 1,
              height: 2,
            },
            shadowOpacity: 9,
            shadowRadius: 6,
            elevation: 6,
          }}
        />

        <MyScrollView />

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Logout Confirmation Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showLogoutModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{}}>
                <Image
                  source={require("./images/logoutimage.jpg")}
                  style={styles.logoutimg}
                />
              </View>

              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 20,
                  marginBottom: 5,
                }}
              >
                Comeback Soon 😇
              </Text>

              <Text style={styles.modalText}>
                Are you sure you want to logout?
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#FF6347" }]}
                  onPress={confirmLogout}
                >
                  <Text style={styles.modalButtonText}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#2ECC71" }]}
                  onPress={() => setShowLogoutModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  userview: {
    width: 330,
    marginTop: 30,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
    borderColor: "#97E7E1",
    borderWidth: 3,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },

  streaks: {
    backgroundColor: "#97E7E1",
    width: 330,
    marginTop: 30,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 120,
  },
  count: {
    flexDirection: "row",
  },
  incr: {
    alignSelf: "center",
  },
  ctasks: {
    width: 155,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "#97E7E1",
    borderWidth: 3,
    backgroundColor: "#FFF",
    shadowColor: "#000", // shadowColor is required for shadow
    shadowOffset: {
      // shadowOffset specifies the shadow's offset
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5, // shadowOpacity specifies the shadow's opacity
    shadowRadius: 4, // shadowRadius specifies the shadow's blur radius
    elevation: 4, // elevation is required for Android shadow
  },

  logoutButton: {
    backgroundColor: "#FF6347",
    width: 325,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 7,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "75%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  logoutimg: {
    width: 280,
    height: 250,
  },
});

export default UserProfileScreen;

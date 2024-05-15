import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import { Avatar, Badge } from "@react-native-material/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import PORT_URL from "./ip";
import MyScrollView from "./MyScrollView"; // Import the MyScrollView component
import { useNavigation, CommonActions } from "@react-navigation/native";

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [habitPendingCount, setHabitPendingCount] = useState(0);
  const [habitCompletedCount, setHabitCompletedCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // Define an async function to fetch data from AsyncStorage
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("data");
        if (data) {
          const parsedData = JSON.parse(data);
          console.log(parsedData.name);
          setUserName(parsedData.name);
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
    fetchHabitCount();
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const today = new Date();
    const pastWeekDates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      pastWeekDates.push(date.toISOString().split("T")[0]);
    }
    console.log(pastWeekDates);
    try {
      const headers = {
        token: await AsyncStorage.getItem("token"),
        "Content-Type": "application/json",
      };
      const data = {
        headers: headers,
        weekDays: pastWeekDates,
      };
      const response = await axios.get(PORT_URL + "/getHabits", { headers });
      console.log(response.data);
    } catch (error) {
      console.log("error " + error);
    }
  };

  const fetchHabitCount = async () => {
    try {
      const headers = {
        token: await AsyncStorage.getItem("token"),
        "Content-Type": "application/json",
      };
      const response = await axios.get(PORT_URL + "/getStatus", { headers });
      console.log("Testing fine");
      setHabitPendingCount(response.data.pendingHabitsCount);
      setHabitCompletedCount(response.data.completedHabitsCount);
    } catch (error) {
      console.log("error fetching habits", error);
    }
  };

  const pendingTasks = [10, 20, 30, 25, 15, 12, 10];
  const completedTasks = [5, 15, 25, 20, 10, 20, 20];

  // Function to handle logout and toggle logout modal visibility
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  // Function to confirm logout

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem("data");
      await AsyncStorage.removeItem("token");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Splash" }],
        })
      );
      // navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
    setShowLogoutModal(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.userview}>
          <Avatar
            image={{ uri: "https://mui.com/static/images/avatar/1.jpg" }}
          />
          <Text variant="h6">{userName}</Text>
        </View>
        <View style={styles.streaks}>
          <Text variant="h6">Streaks</Text>
          <View style={styles.count}>
            <Text variant="h6">🔥</Text>
            <Badge style={styles.incr} label={123} color="primary" />
          </View>
        </View>

        <Text
          style={{
            alignSelf: "flex-start",
            marginLeft: 10,
            marginVertical: 15,
          }}
        >
          Tasks Overview
        </Text>

        <View style={{ flexDirection: "row", gap: 20 }}>
          <View style={styles.ctasks}>
            <Text variant="h6">{habitCompletedCount}</Text>
            <Text style={{ fontSize: 18, marginTop: 10 }} variant="h6">
              Completed Tasks
            </Text>
          </View>
          <View style={styles.ctasks}>
            <Text variant="h6">{habitPendingCount}</Text>
            <Text style={{ fontSize: 18, marginTop: 10 }} variant="h6">
              Pending Tasks
            </Text>
          </View>
        </View>

        {/* Include the MyScrollView component */}
        <Text
          style={{
            alignSelf: "flex-start",
            marginLeft: 10,
            marginVertical: 15,
          }}
        >
          Habit Trends
        </Text>

        <LineChart
          data={{
            labels: ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"], // Example labels
            datasets: [
              {
                data: pendingTasks, // Array of pending tasks data points
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Color for pending tasks
                strokeWidth: 2, // Stroke width for pending tasks
              },
              {
                data: completedTasks, // Array of completed tasks data points
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Color for completed tasks
                strokeWidth: 2, // Stroke width for completed tasks
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
    backgroundColor: "#97E7E1",
    width: 330,
    marginTop: 30,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
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
    backgroundColor: "#97E7E1",
    width: 155,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
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

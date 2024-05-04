import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Badge, Text } from "@react-native-material/core";
import MyScrollView from "./MyScrollView"; // Import the MyScrollView component
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const UserProfileScreen = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Define an async function to fetch data from AsyncStorage
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("data");
        if (data) {
          const parsedData = JSON.parse(data);
          setUserName(parsedData.name);
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []); // Empty dependency array to ensure the effect runs only once

  const pendingTasks = [10, 20, 30, 25, 15];
  const completedTasks = [5, 15, 25, 20, 10];

  return (
    <ScrollView>
      <View style={styles.container}>
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
            <Text variant="h6">0</Text>
            <Text style={{ fontSize: 18, marginTop: 10 }} variant="h6">
              Completed Tasks
            </Text>
          </View>
          <View style={styles.ctasks}>
            <Text variant="h6">0</Text>
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
            labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"], // Example labels
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
      </View>
    </ScrollView>
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
});

export default UserProfileScreen;
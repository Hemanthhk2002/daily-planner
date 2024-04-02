import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Badge, Text } from "@react-native-material/core";
import MyScrollView from "./MyScrollView"; // Import the MyScrollView component
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserProfileScreen = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Define an async function to fetch data from AsyncStorage
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("data");
        if (data) {
          const parsedData = JSON.parse(data);
          // console.log("parse data ", parsedData);
          if (parsedData && parsedData.data) {
            // console.log(parsedData.data);
            const userData = parsedData.data;
            // Access specific properties of the user data object
            const { _id, name, email } = userData;
            // Update state with the retrieved data
            setUserName(name);
          }
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []); // Empty dependency array to ensure the effect runs only once

  return (
    <View style={styles.container}>
      <View style={styles.userview}>
        <Avatar image={{ uri: "https://mui.com/static/images/avatar/1.jpg" }} />
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
        style={{ alignSelf: "flex-start", marginLeft: 10, marginVertical: 15 }}
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
      <MyScrollView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    backgroundColor: "#EDFCF4",
    padding: 10,
  },
  userview: {
    backgroundColor: "#93E9BE",
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
    backgroundColor: "#93E9BE",
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
    backgroundColor: "#93E9BE",
    width: 155,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});

export default UserProfileScreen;

import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import Schedule from "./components/Schedule";

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [scheduleModal, setScheduleModal] = useState(false);
  const [passData, setPassData] = useState("");

  const handleDayPress = (date) => {
    setSelectedDate(date.dateString);
    const today = new Date(date.dateString); // Get current date and time
    const yesterday = new Date(today); // Create a new date object with the current date and time
    yesterday.setDate(today.getDate());
    const offsetTime = yesterday.getTime() + 5.5 * 60 * 60 * 1000;
    const adjustedDate = new Date(offsetTime);

    const formattedDate = adjustedDate;
    console.log(formattedDate);
    setPassData(formattedDate);
    setScheduleModal(true);
  };

  const openScheduleModal = () => {
    console.log(new Date());
    const today = new Date(); // Get current date and time
    const yesterday = new Date(today); // Create a new date object with the current date and time
    yesterday.setDate(today.getDate());
    const offsetTime = yesterday.getTime() + 5.5 * 60 * 60 * 1000;
    const adjustedDate = new Date(offsetTime);

    const formattedDate = adjustedDate;

    // Log the formatted date
    console.log(formattedDate);

    // Set the state passData with the formatted date
    setPassData(formattedDate);

    // Open the schedule modal
    setScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setScheduleModal(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <View style={styles.container}>
      <Schedule
        visible={scheduleModal}
        onClose={closeScheduleModal}
        passedDate={passData} // Pass selectedDate as a prop
      />

      <Text style={styles.calendarText}>Calendar</Text>

      <Calendar
        style={styles.calendar}
        minDate={today}
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#97E7E1",
            selectedTextColor: "#000000",
          },
        }}
      />

      <TouchableOpacity onPress={openScheduleModal}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>My Schedule</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    backgroundColor: "#ffffff",
    paddingBottom: 130,
  },
  calendarText: {
    fontSize: 30,
    marginTop: 80,
    marginHorizontal: "30%",
    fontWeight: "bold",
  },
  calendar: {
    borderRadius: 10,
    elevation: 0,
    marginTop: 40,
    marginHorizontal: 0,
    backgroundColor: "#D4F1F4",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#97E7E1",
    borderColor: "#97E7E1",
    margin: 25,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#000000",
  },
});

export default ScheduleScreen;

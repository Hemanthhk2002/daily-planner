import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Schedule from "./components/Schedule";

const ScheduleScreen = () => {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [scheduleModal, setScheduleModal] = useState(false);

  const handleDayPress = (date) => {
    setSelectedDate(date.dateString);
    console.log(selectedDate);
    setScheduleModal(true);
  };

  const openScheduleModal = () => {
    console.log(selectedDate);
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
        selectedDate={selectedDate}
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
      {/* </ImageBackground> */}
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
//import { StyleSheet, Text, View, TouchableOpacity, Modal} from "react-native";
import { Calendar } from "react-native-calendars";
import { useState } from "react";
// import { FontAwesome } from '@expo/vector-icons';
import React from "react";
import Schedule from "./components/Schedule";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

const ScheduleScreen = () => {
  const [visible, setVisible] = React.useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [scheduleModal, setScheduleModal] = useState(false);

  const handleDayPress = (date) => {
    setSelectedDate(date.dateString);
    console.log(date);
    setScheduleModal(true);
  };

  const openScheduleModal = () => {
    setScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setScheduleModal(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <View style={{ flex: 1 }}>
      <Schedule visible={scheduleModal} onClose={closeScheduleModal} />

      <Text style={styles.calendarText}>Calendar</Text>

      <Calendar
        style={{
          borderRadius: 10,
          elevation: 4,
          marginTop: 50,
          marginHorizontal: 30,
        }}
        minDate={today}
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#b0d598" },
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
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  calendarText: {
    alignItems: "center",
    marginTop: 80,
    marginHorizontal: "40%",
  },
  radioGroup: {
    flexDirection: "column",
    alignItems: "left",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: "#333",
  },
  buttonSubmit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#b0d598",
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#b0d598",
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  mySchedule: {
    alignItems: "center",
    margin: 30,
    backgroundColor: "#b0d598",
    padding: 20,
    borderRadius: 10,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#b0d598",
    borderColor: "#b0d598",
    margin: 25,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});

export default ScheduleScreen;

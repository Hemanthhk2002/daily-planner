import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Calendar, CalendarTheme } from "react-native-calendars";
import Schedule from "./components/Schedule";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import PORT_URL from "./ip";

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().dateString);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [passData, setPassData] = useState("");
  const [scheduleData, setScheduleData] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Define an async function to fetch data from AsyncStorage
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("data");
        if (data) {
          const parsedData = JSON.parse(data);
          setEmail(parsedData.email);
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);

  useEffect(() => {
    getSchedule(new Date().toISOString().split("T")[0]);
  }, [scheduleData]);

  const handleDayPress = (date) => {
    setSelectedDate(date.dateString);
    const today = new Date(date.dateString); // Get current date and time
    const yesterday = new Date(today); // Create a new date object with the current date and time
    yesterday.setDate(today.getDate());
    const offsetTime = yesterday.getTime() + 5.5 * 60 * 60 * 1000;
    const adjustedDate = new Date(offsetTime);

    const formattedDate = adjustedDate;
    setPassData(formattedDate);
    setScheduleModal(true);
  };

  const getSchedule = async (item) => {
    const data = {
      email: email,
      date: item,
    };

    try {
      const headers = {
        token: await AsyncStorage.getItem("token"),
        "Content-Type": "application/json",
      };
      const response = await axios.post(PORT_URL + "/getSchedule", data, {
        headers,
      });
      console.log("ScheduleData", response.data);
      const sortedEvents = response.data.data.sort((a, b) => {
        const timeA = a.time.toLowerCase();
        const timeB = b.time.toLowerCase();
        return timeA.localeCompare(timeB);
      });
      // setScheduleData(sortedEvents); //don't do that
    } catch (error) {
      console.log(error);
    }
  };

  const openScheduleModal = () => {
    const today = new Date(); // Get current date and time
    const yesterday = new Date(today); // Create a new date object with the current date and time
    yesterday.setDate(today.getDate());
    const offsetTime = yesterday.getTime() + 5.5 * 60 * 60 * 1000;
    const adjustedDate = new Date(offsetTime);

    const formattedDate = adjustedDate;
    setPassData(formattedDate);

    // Open the schedule modal
    setScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setScheduleModal(false);
  };

  const today = new Date().toISOString().split("T")[0];

  const customTheme = {
    textMonthFontSize: 24,
    textSectionTitleColor: "#000000",
    agendaKnobColor: "#000000",
  };

  // Custom arrow component
  const renderArrow = (direction) => {
    return (
      <View
        style={[
          styles.arrowContainer,
          direction === "left" ? styles.leftArrow : styles.rightArrow,
        ]}
      >
        <Icon
          name={direction === "left" ? "chevron-left" : "chevron-right"}
          size={18}
          color="#ffffff"
        />
      </View>
    );
  };

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
            selectedBackgroundColor: "#97E7E1",
          },
        }}
        theme={customTheme}
        renderArrow={renderArrow} // Custom arrow component
      />
      <View style={styles.lineContainer}>
        <View style={styles.line} />
        <Text style={styles.lineText}>Today Events</Text>
        <View style={styles.line} />
      </View>

      <ScrollView style={styles.scrollView}>
        {scheduleData.map((item, index) => (
          <TouchableOpacity key={index} style={styles.scheduleItem}>
            <View style={styles.scheduleItemContent}>
              <Text style={styles.scheduleItemTitle}>{item.name}</Text>
              <Text style={styles.scheduleItemTime}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 40,
    paddingBottom: 10,
  },
  calendarText: {
    fontSize: 15,
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  calendar: {
    borderRadius: 10,
    elevation: 0,
    marginTop: 20,
    marginHorizontal: 10,
  },
  lineContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    flexDirection: "row",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#000000",
    width: "40%",
    marginHorizontal: 10,
  },
  lineText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginLeft: 0,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 20,
  },
  scheduleItem: {
    padding: 15,
    marginVertical: 7,
    borderRadius: 5,
    backgroundColor: "#97E7E1",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  scheduleItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scheduleItemTitle: {
    fontWeight: "bold",
  },
  scheduleItemTime: {
    color: "#555",
  },
});

export default ScheduleScreen;

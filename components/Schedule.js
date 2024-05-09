import React, { useState, useRef, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  Platform,
  Animated,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import moment from "moment";
import Swiper from "react-native-swiper";
import PORT_URL from "../ip";
import usePushNotifications from "../notification";

const { width } = Dimensions.get("window");

const ModalPoup = ({ visible, children }) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;

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

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function Schedule({ visible, onClose, passedDate }) {
  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [addVisible, setAddVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("repeat");
  const [date, setDate] = useState(new Date());

  const [showPicker, setShowPicker] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false); // State variable to manage time picker visibility
  const [selectedTime, setSelectedTime] = useState(new Date()); // State variable to store selected time
  const [deletingItem, setDeletingItem] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");

  const days = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];

  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const handlePress = (day) => {
    let updatedSelection = [...selectedDays];

    // If the day is already selected, remove it from the selection
    if (selectedDays.includes(day)) {
      updatedSelection = updatedSelection.filter((item) => item !== day);
    } else {
      // Otherwise, add it to the selection
      updatedSelection.push(day);
    }

    setSelectedDays(updatedSelection);
  };

  const { scheduleReminder, cancelScheduledNotification } =
    usePushNotifications();

  const weeks = React.useMemo(() => {
    const start = moment().add(week, "weeks").startOf("week");

    return [-1, 0, 1].map((adj) => {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = moment(start).add(adj, "week").add(index, "day");

        return {
          weekday: date.format("ddd"),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  const onChangeDate = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS == "android") {
        toggleDatepicker();
        setScheduleDate(currentDate);
      } else {
        toggleDatepicker();
      }
    } else {
      toggleDatepicker();
    }
  };

  useEffect(() => {
    if (visible) {
      console.log("passedData = " + passedDate);
      getSchedule(passedDate);
    }
  }, [visible]);

  const handleSubmit = async () => {
    let repeatVal;
    setAddVisible(false);
    if (selectedValue == "repeat") {
      repeatVal = true;
    } else {
      repeatVal = false;
    }

    const data = {
      email: email,
      name: name,
      description: description, // Pass description here
      date: scheduleDate.toISOString().split("T")[0],
      time: formattedTime,
      repeat: repeatVal,
      repeatOnDays: selectedDays,
    };

    console.log(description);
    console.log(data);
    setSelectedDays([]);
    setDescription("");
    setScheduleDate(new Date());
    setSelectedTime(new Date());

    try {
      const response = await axios.post(PORT_URL + "/add", data);
      console.log("dfsdf");
      console.log(response.data.data._id);
      scheduleReminder(
        response.data.data._id,
        name,
        description,
        data.date,
        data.time
      )
        .then(() => {
          console.log("Notification scheduled successfully!");
        })
        .catch((error) => {
          console.error("Failed to schedule notification:", error);
        });

      await getScheduleAfterDelete(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(passedDate);
  }, [passedDate]);

  useEffect(() => {
    console.log("value = " + value);
    getSchedule(value);
  }, [value]);

  useEffect(() => {
    // Define an async function to fetch data from AsyncStorage
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("data");
        //console.log(data.name);
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

  const getSchedule = async (item) => {
    setValue(item);
    const formattedDate = moment(value, "ddd MMM DD YYYY").format("YYYY-MM-DD");
    console.log(formattedDate);
    const data = {
      email: email,
      date: formattedDate,
    };
    console.log(data);

    try {
      const response = await axios.post(PORT_URL + "/getSchedule", data);

      const sortedEvents = response.data.data.sort((a, b) => {
        const timeA = a.time.toLowerCase();
        const timeB = b.time.toLowerCase();
        return timeA.localeCompare(timeB);
      });

      console.log(sortedEvents);
      setScheduleData(sortedEvents);
    } catch (error) {
      console.log(error);
    }
  };

  const getScheduleAfterDelete = async (item) => {
    // Ensure that item.date is defined and is a valid Date object
    const data = {
      email: email,
      date: item.date,
    };
    console.log(data);

    try {
      const response = await axios.post(PORT_URL + "/getSchedule", data);

      const sortedEvents = response.data.data.sort((a, b) => {
        const timeA = a.time.toLowerCase();
        const timeB = b.time.toLowerCase();
        return timeA.localeCompare(timeB);
      });

      console.log(sortedEvents);
      setScheduleData(sortedEvents);
    } catch (error) {
      console.log(error);
    }
  };

  const onTimeChange = (event, selected) => {
    const currentTime = selected || selectedTime;
    setShowTimePicker(Platform.OS === "ios"); // For iOS, set time picker visibility based on platform behavior
    setSelectedTime(currentTime); // Update selected time
  };

  const toggleDeleteModal = (item) => {
    //console.log(item);
    setDeletingItem(item);
    setDeleteModalVisible(!deleteModalVisible);
  };

  const deleteScheduleItem = async () => {
    try {
      //console.log(deletingItem._id);
      const response = await axios.post(PORT_URL + "/deleteScheduleItem", {
        _id: deletingItem._id,
      });
      if (response.data.status == "ok") {
        console.log("Schedule item deleted successfully.");
        // Call getSchedule to refresh the schedule list
        cancelScheduledNotification(deletingItem._id)
          .then(() => {
            console.log("Notification deleted successfully!");
          })
          .catch((error) => {
            console.error("Failed to schedule notification:", error);
          });
        await getScheduleAfterDelete(deletingItem);
      }
      toggleDeleteModal();
    } catch (error) {
      console.log("Error deleting schedule item:", error);
    }
  };

  const currentTime = new Date(); // Get current time in local timezone
  const hours = currentTime.getHours(); // Extract hours

  let formattedHours = hours % 12;
  if (formattedHours === 0) {
    formattedHours = 12;
  }
  if (hours >= 12) {
    meridiem = "PM";
  }

  const formattedTime = selectedTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // Set to true for 12-hour format
  });

  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1 }}>
        <ModalPoup visible={addVisible}>
          <TouchableOpacity
            onPress={() => setAddVisible(false)}
            style={styles.closeButton}
          >
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}></View>

          <View>
            <View style={{ borderRadius: 5 }}>
              <Text style={{ fontWeight: "bold", padding: 6, fontSize: 18 }}>
                Schedule your work...
              </Text>
              <View
                style={{
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#D4F1F4",
                    borderRadius: 10,
                    padding: 6,
                  }}
                >
                  <Text
                    style={{
                      marginRight: 10,
                      // backgroundColor: "#97E7E1",
                      padding: 3,
                      borderRadius: 2,
                    }}
                  >
                    Name:
                  </Text>
                  <TextInput
                    style={{
                      flex: 1,
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                    onChangeText={(text) => setName(text)}
                    placeholder="Enter your name"
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#D4F1F4",
                    borderRadius: 10,
                    padding: 6,
                  }}
                >
                  <Text
                    style={{
                      marginRight: 10,
                      // backgroundColor: "#97E7E1",
                      padding: 3,
                      borderRadius: 2,
                      paddingRight: 10,
                    }}
                  >
                    Date:
                  </Text>
                  {!showPicker && (
                    <Pressable onPress={toggleDatepicker}>
                      <TextInput
                        style={{
                          flex: 1,
                          textAlign: "center",
                          justifyContent: "center",
                          marginHorizontal: 50,
                        }}
                        value={scheduleDate.toISOString().split("T")[0]}
                        onChangeText={setScheduleDate}
                        editable={false}
                        onPressIn={toggleDatepicker}
                      />
                    </Pressable>
                  )}
                  {showPicker && (
                    <DateTimePicker
                      mode="date"
                      display="spinner"
                      value={date}
                      onChange={onChangeDate}
                      style={styles.datePicker}
                    />
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#D4F1F4",
                    borderRadius: 10,
                    padding: 6,
                  }}
                >
                  <Text
                    style={{
                      marginRight: 10,
                      // backgroundColor: "#97E7E1",
                      padding: 3,
                      borderRadius: 2,
                      paddingRight: 10,
                    }}
                  >
                    Time:
                  </Text>
                  {!showTimePicker && (
                    <Pressable onPress={toggleTimePicker}>
                      <TextInput
                        style={{
                          flex: 1,
                          textAlign: "center",
                          justifyContent: "center",
                          marginHorizontal: 50,
                        }}
                        value={formattedTime}
                        onChangeText={setScheduleTime}
                        editable={false}
                        onPressIn={toggleTimePicker}
                      />
                    </Pressable>
                  )}

                  {showTimePicker && (
                    <DateTimePicker
                      mode="time"
                      display="spinner"
                      value={selectedTime}
                      onChange={onTimeChange}
                    />
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: 5,
                flexDirection: "column", // Change flexDirection to column
                backgroundColor: "#D4F1F4",
                borderRadius: 10,
                padding: 10, // Increase padding for better spacing
                marginBottom: 10, // Add marginBottom for spacing between views
              }}
            >
              <Text
                style={{
                  marginBottom: 5, // Add marginBottom for spacing between text and input
                }}
              >
                Description
              </Text>
              {/* Three lines for input space */}
              <TextInput
                style={{
                  height: 100, // Adjust height to create three lines of input space
                  textAlignVertical: "top", // Align text to top for multiline input
                  backgroundColor: "#ffffff", // Add background color for better visibility
                  borderRadius: 5, // Add borderRadius for better aesthetics
                  paddingHorizontal: 10, // Add horizontal padding for better spacing
                }}
                onChangeText={(text) => setDescription(text)}
                placeholder="Describe your event.."
                multiline={true} // Enable multiline input
                numberOfLines={3} // Set number of lines to 3
              />
            </View>

            <View style={styles.radioGroup}>
              <View style={styles.radioButton}>
                <RadioButton.Android
                  value="donotrepeat"
                  status={
                    selectedValue === "donotrepeat" ? "checked" : "unchecked"
                  }
                  onPress={() => setSelectedValue("donotrepeat")}
                  color="#97E7E1"
                />
                <Text style={styles.radioLabel}>Do not Repeat</Text>
              </View>

              <View style={styles.radioButton}>
                <RadioButton.Android
                  value="repeat"
                  status={selectedValue === "repeat" ? "checked" : "unchecked"}
                  onPress={() => setSelectedValue("repeat")}
                  color="#97E7E1"
                />

                <Text style={styles.radioLabel}>Repeat on</Text>
              </View>

              {selectedValue === "repeat" && (
                <View style={styles.daycontainer}>
                  {days?.map((item, index) => (
                    <Pressable
                      key={index}
                      style={[
                        styles.dayButton,
                        {
                          backgroundColor: selectedDays.includes(item)
                            ? "#97E7E1"
                            : "#E0E0E0",
                        },
                      ]}
                      onPress={() => handlePress(item)}
                    >
                      <Text>{item}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.buttonSubmit}
              onPress={handleSubmit}
            >
              <Text>Submit</Text>
            </TouchableOpacity>
          </View>
        </ModalPoup>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.title}>Your Schedule</Text>
          </View>

          <View style={styles.picker}>
            <Swiper
              index={1}
              ref={swiper}
              loop={false}
              showsPagination={false}
              onIndexChanged={(ind) => {
                if (ind === 1) {
                  return;
                }
                setTimeout(() => {
                  const newIndex = ind - 1;
                  const newWeek = week + newIndex;
                  setWeek(newWeek);
                  setValue(moment(value).add(newIndex, "week").toDate());
                  swiper.current.scrollTo(1, false);
                }, 100);
              }}
            >
              {weeks.map((dates, index) => (
                <View
                  style={[styles.itemRow, { paddingHorizontal: 16 }]}
                  key={index}
                >
                  {dates.map((item, dateIndex) => {
                    const isActive =
                      value.toDateString() === item.date.toDateString();
                    return (
                      <TouchableWithoutFeedback
                        key={dateIndex}
                        onPress={() => {
                          console.log(item);
                          getSchedule(item.date);
                        }}
                      >
                        <View
                          style={[
                            styles.item,
                            isActive && {
                              backgroundColor: "#111",
                              borderColor: "#111",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.itemWeekday,
                              isActive && { color: "#fff" },
                            ]}
                          >
                            {item.weekday}
                          </Text>
                          <Text
                            style={[
                              styles.itemDate,
                              isActive && { color: "#fff" },
                            ]}
                          >
                            {item.date.getDate()}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    );
                  })}
                </View>
              ))}
            </Swiper>
          </View>

          <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
            <Text style={styles.subtitle}>{value.toDateString()}</Text>
            <View style={styles.placeholder}>
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.placeholderSchedule}>
                  {scheduleData.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.scheduleItem}>
                      {/* Render text field for each item */}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View>
                          <Text style={{ fontWeight: "bold" }}>
                            {item.name}
                          </Text>
                          <Text>{item.time}</Text>
                          {/* Add more fields as needed */}
                        </View>
                        {/* Dustbin icon */}
                        <TouchableOpacity
                          onPress={() => toggleDeleteModal(item)}
                        >
                          <FontAwesome name="trash" size={24} color="#d1d1d1" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          <ModalPoup visible={deleteModalVisible}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 18, marginBottom: 20 }}>
                Delete Schedule?
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={deleteScheduleItem}
                  style={[styles.buttonDelete, { backgroundColor: "#FF6347" }]}
                >
                  <Text
                    style={{
                      color: "#fff",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                    }}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={toggleDeleteModal}
                  style={[
                    styles.buttonDelete,
                    { backgroundColor: "#97E7E1", marginLeft: 20 },
                  ]}
                >
                  <Text
                    style={{
                      color: "#fff",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ModalPoup>

          <View style={styles.footer}>
            {/* <TouchableOpacity
              onPress={() => {
                setAddVisible(true);
              }}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>Add Schedule</Text>
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => setAddVisible(true)}
            >
              <FontAwesome name="plus" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    marginTop: 25,
  },
  header: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#97E7E1",
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#999999",
    marginBottom: 12,
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: 16,
  },
  /** Item */
  item: {
    flex: 1,
    height: 50,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "black",
    flexDirection: "column",
    alignItems: "center",
  },
  itemRow: {
    width: width,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginHorizontal: -4,
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: "500",
    color: "#737373",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  /** Placeholder */
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 0,
    backgroundColor: "transparent",
  },
  placeholderInset: {
    borderWidth: 4,
    borderColor: "#e5e7eb",
    borderRadius: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    marginTop: 15,
    zIndex: 999, // Ensure it's above other content
  },
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
    borderRadius: 10,
    elevation: 20,
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
    backgroundColor: "#97E7E1",
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  button: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#97E7E1",
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
    backgroundColor: "#97E7E1",
    borderColor: "#97E7E1",
    margin: 25,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#000",
  },
  placeholderSchedule: {
    borderWidth: 4,
    borderColor: "#ffffff",
    borderRadius: 9,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  scheduleItem: {
    padding: 10,
    margin: 7,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  daycontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 50,
  },
  dayButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  buttonDelete: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

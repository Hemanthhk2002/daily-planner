import React, { useState, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  Button,
  Image,
  Platform,
  Animated,
  TextInput,
  Pressable,
  CheckBox,
  ScrollView,
} from "react-native";
import moment from "moment";
import Swiper from "react-native-swiper";

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

export default function Schedule({ visible, onClose }) {
  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [addVisible, setAddVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("repeat");
  const [date, setDate] = useState(new Date());

  const [showPicker, setShowPicker] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());

  const [scheduleTime, setScheduleTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false); // State variable to manage time picker visibility
  const [selectedTime, setSelectedTime] = useState(new Date()); // State variable to store selected time


  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  const [scheduleData, setScheduleData] = useState([]);

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

  const handleSubmit = async () => {
    let repeatVal;
    console.log(selectedValue);
    setAddVisible(false);
    if (selectedValue == "repeat") {
      repeatVal = true;
    } else {
      repeatVal = false;
    }
    const data = {
      email: "sana@gmail.com",
      name: name,
      date: scheduleDate.toISOString().split("T")[0],
      time: formattedTime,
      repeat: repeatVal,
    };

    console.log(data);

    try {
      const response = await axios.post("http://192.168.180.191:3000/add", data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSchedule = async (item) => {
    setValue(item.date);

    const formattedDate = moment(value, "ddd MMM DD YYYY").format("YYYY-MM-DD");
    console.log(formattedDate);
    const data = {
      email: "sana@gmail.com",
      date: formattedDate,
    };
    console.log(data);

    try {
      const response = await axios.post(
        "http://192.168.180.191:3000/getSchedule",
        data
      );
      console.log(response.data);
      setScheduleData(response.data.data);
      console.log(response.data.data);
      const sortedEvents = response.data.data.sort((a, b) => {
        const timeA = a.time.toLowerCase();
        const timeB = b.time.toLowerCase();
        return timeA.localeCompare(timeB);
      });

      setScheduleData(sortedEvents);

    } catch (error) {
      console.log(error);
    }
  };

  const onTimeChange = (event, selected) => {
    const currentTime = selected || selectedTime;
    setShowTimePicker(Platform.OS === 'ios'); // For iOS, set time picker visibility based on platform behavior
    setSelectedTime(currentTime); // Update selected time
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

  const formattedTime = selectedTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true, // Set to true for 12-hour format
  });

  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1 }}>
        <ModalPoup visible={addVisible}>
          <TouchableOpacity onPress={() => setAddVisible(false)} style={styles.closeButton}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}></View>

          <View>
            <View style={{ backgroundColor: "#E0FFFF", borderRadius: 5 }}>
              <Text style={{ padding: 6, fontSize: 16 }}>
                Schedule your work...
              </Text>
            </View>



            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  marginRight: 10,
                  backgroundColor: "#E0FFFF",
                  padding: 3,
                  borderRadius: 5,
                }}
              >
                Name
              </Text>
              <TextInput
                style={{ flex: 1 }}
                onChangeText={(text) => setName(text)}
                placeholder="Enter your name"
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  marginRight: 10,
                  backgroundColor: "#E0FFFF",
                  padding: 3,
                  borderRadius: 5,
                  paddingRight: 10,
                }}
              >
                Date
              </Text>
              {!showPicker && (
                <Pressable onPress={toggleDatepicker}>
                  <TextInput
                    style={{ flex: 1 }}
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
                marginTop: 2,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginRight: 10,
                  backgroundColor: "#E0FFFF",
                  padding: 3,
                  borderRadius: 5,
                  paddingRight: 10,
                }}
              >
                Time
              </Text>
              {!showTimePicker && (
                <Pressable onPress={toggleTimePicker}>
                  <TextInput
                    style={{ flex: 1 }}
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
            <View style={styles.radioGroup}>
              <View style={styles.radioButton}>
                <RadioButton.Android
                  value="repeat"
                  status={selectedValue === "repeat" ? "checked" : "unchecked"}
                  onPress={() => setSelectedValue("repeat")}
                  color="#E0FFFF"
                />
                {/* {selectedValue === "repeat" && (
                  <Text>Hello World</Text>
                )} */}

                <Text style={styles.radioLabel}>Repeat on</Text>
              </View>

              <View style={styles.radioButton}>
                <RadioButton.Android
                  value="donotrepeat"
                  status={selectedValue === "donotrepeat" ? "checked" : "unchecked"}
                  onPress={() => setSelectedValue("donotrepeat")}
                  color="#E0FFFF"
                />
                <Text style={styles.radioLabel}>Do not Repeat</Text>
              </View>
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
                        onPress={() => getSchedule(item)}
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
                    <View
                      key={index}
                      style={[
                        styles.scheduleItem,
                        index % 2 === 0 ? styles.scheduleItemEven : null,
                      ]}
                    >
                      {/* Render text field for each item */}
                      <Text>{item.name}</Text>
                      <Text>{item.time}</Text>
                      {/* Add more fields as needed */}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => {
                setAddVisible(true);
              }}
            >
              <View style={styles.btn}>
                <Text style={styles.btnText}>Add Schedule</Text>
              </View>
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
    borderColor: "#e3e3e3",
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
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#E0FFFF",
    borderColor: "#E0FFFF",
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
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
    borderRadius: 20,
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
    backgroundColor: "#E0FFFF",
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
    backgroundColor: "#E0FFFF",
    borderColor: "#E0FFFF",
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
    flexGrow: 1, // Default background color
    flexShrink: 1,
    flexBasis: 0,
  },
  scheduleItem: {
    backgroundColor: "#ffffff", // Default background color
    padding: 10,
  },
  scheduleItemEven: {
    backgroundColor: "#E0FFFF", // Green background color for alternate items
  },
});
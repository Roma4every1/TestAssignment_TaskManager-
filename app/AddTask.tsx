import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "react-native-paper";
import { saveTask } from "@/store/storage";
import { Task } from "@/types";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Colors } from "@/constants/Colors";

const AddTaskScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!title || !description || !location || !date) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    const newTask: Task = {
      id: String(Date.now()), // Generate unique ID
      title,
      description,
      location,
      date: date.toISOString(), // Store date as ISO string
      status: "inProgress",
    };

    await saveTask(newTask);
    router.push("/"); // Navigate back to task list
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  return (
    <LinearGradient
      colors={[Colors.secondary, Colors.primary]}
      locations={[0, 0.35]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon source="arrow-left" size={30} color={Colors.mainText} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Task</Text>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.form}>
        <TextInput
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholderTextColor={Colors.additionalText}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          placeholderTextColor={Colors.additionalText}
          multiline
        />
        <TextInput
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          placeholderTextColor={Colors.additionalText}
        />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={showDatePicker} // Show Date Picker when clicked
        >
          <Text style={styles.dateButtonText}>
            {date ? date.toLocaleString() : "Pick a Due Date"}
          </Text>
        </TouchableOpacity>

        {/* Modal Date Picker */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          date={date}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Task</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: `${Colors.mainText}`,
    marginLeft: 10,
  },
  form: {
    marginTop: 20,
  },
  input: {
    backgroundColor: `${Colors.primary}`,
    color: `${Colors.mainText}`,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    height: 60,
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  dateButton: {
    backgroundColor: `${Colors.primary}`,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  dateButtonText: {
    color: `${Colors.additionalText}`,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: `${Colors.secondary}`,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: `${Colors.mainText}`,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddTaskScreen;

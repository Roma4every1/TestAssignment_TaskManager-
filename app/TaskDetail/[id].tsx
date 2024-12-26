import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { loadTasks } from "@/store/storage";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "react-native-paper";
import { Colors } from "@/constants/Colors";

export const InitialState = {
  id: "",
  title: "",
  description: "",
  location: "",
  date: "",
  status: "inProgress",
};

const TaskDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState(InitialState);

  useEffect(() => {
    const loadTask = async () => {
      if (!id) return;
      const tasks = await loadTasks();
      const foundTask = tasks.find((task) => task.id === id);
      if (!foundTask) return;
      setTask(foundTask);
    };
    loadTask();
  }, [id]);

  if (!task) {
    return <Text>Task not found</Text>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "inProgress":
        return "#2196F3";
      case "canceled":
        return "#F44336";
      default:
        return "#E91E63";
    }
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
          <Icon source="arrow-left" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Task Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskDescription}>{task.description}</Text>
        <Text style={styles.taskInfo}>Location: {task.location}</Text>
        <Text style={styles.taskInfo}>
          Date: {new Date(task.date).toLocaleString()}
        </Text>
        <Text
          style={[styles.taskStatus, { color: getStatusColor(task.status) }]}
        >
          Status: {task.status}
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",

    paddingTop: 10,
    marginBottom: 30,
  },
  backButton: {
    padding: 10,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: `${Colors.mainText}`,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  taskTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: `${Colors.mainText}`,
    marginBottom: 10,
  },
  taskDescription: {
    color: `${Colors.additionalText}`,
    fontSize: 16,
    marginBottom: 20,
  },
  taskInfo: {
    color: `${Colors.additionalText}`,
    fontSize: 16,
    marginBottom: 10,
  },
  taskStatus: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TaskDetailScreen;

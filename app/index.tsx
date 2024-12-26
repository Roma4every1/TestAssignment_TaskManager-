import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { loadTasks } from "@/store/storage";
import TaskItem from "../components/TaskItem";
import { Task } from "@/types";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Icon, Menu } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { formatDate } from "@/utils/formatDate";
import StatusSelector from "@/components/StatusSelector";

const TaskListScreen = () => {
  const {
    data: tasks,
    isLoading,
    refetch,
  } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: loadTasks,
  });

  const [sortedTasks, setSortedTasks] = useState<Task[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>("All");
  const [visible, setVisible] = useState(false);
  const [sortByDateAsc, setSortByDateAsc] = useState(true);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!tasks) return;

    let sorted = [...tasks];

    // Фильтруем по статусу
    if (currentStatus !== "All") {
      sorted = sorted.filter((item) => item.status === currentStatus);
    }

    // Сортировка по дате
    sorted.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortByDateAsc ? dateA - dateB : dateB - dateA;
    });

    setSortedTasks(sorted);
    setVisible(false);
  }, [tasks, currentStatus, sortByDateAsc]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <LinearGradient
      colors={[Colors.secondary, Colors.primary]}
      locations={[0, 0.3]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <StatusBar hidden />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          maxWidth: 400,
          justifyContent: "space-around",
          alignItems: "center",
          paddingTop: 10,
        }}
      >
        <Text style={styles.title}>Todo List</Text>
        {/* Кнопка добавления задачи */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/AddTask")}
        >
          <Icon size={80} source={"plus"} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.sortButtons}>
        {/* Status Menu */}
        <StatusSelector
          visible={visible}
          setVisible={setVisible}
          currentStatus={currentStatus}
          setCurrentStatus={setCurrentStatus}
        />

        {/* Кнопка сортировки по дате */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSortByDateAsc(!sortByDateAsc)} // Переключение порядка сортировки
        >
          <Text style={styles.sortButtonText}>
            Sort by Date ({sortByDateAsc ? "Ascending" : "Descending"})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.todoList}>
        {sortedTasks?.map((item) => (
          <TaskItem
            task={{
              ...item,
              date: formatDate(item.date),
            }}
            key={item.id}
          />
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    paddingHorizontal: 0,
    flexDirection: "column",
    gap: 10,
  },
  todoList: {
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 70,
  },
  title: {
    textAlign: "center",
    color: `${Colors.mainText}`,
    fontSize: 34,
    fontWeight: "bold",
  },
  addButton: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRadius: "50%",
    backgroundColor: `${Colors.primary}`,
    width: 100,
    height: 100,
  },
  sortButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
  },

  sortButtonText: {
    color: `${Colors.additionalText}`,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
  },
  statusSelector: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "center",
  },
  menuButton: {
    backgroundColor: "#333",
    color: `${Colors.mainText}`,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 140,
  },
});

export default TaskListScreen;

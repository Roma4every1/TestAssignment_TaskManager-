import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Task } from "@/types";
import { updateTaskStatus, deleteTask } from "@/store/storage";
import { router } from "expo-router";
import { IconButton, Menu, Button, Icon } from "react-native-paper";
import Toast from "react-native-toast-message";
import { Colors } from "@/constants/Colors";

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [visible, setVisible] = useState(false);

  const handleStatusChange = async (
    newStatus: "inProgress" | "completed" | "canceled"
  ) => {
    await updateTaskStatus(task.id, newStatus);
    setTaskStatus(newStatus);
    setVisible(false);
    Toast.show({
      type: "success",
      text1: `Task status updated to ${newStatus}`,
    });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            await deleteTask(task.id);
            Toast.show({
              type: "error",
              text1: "Task deleted",
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleViewDetails = () => {
    router.push({ pathname: "/TaskDetail/[id]", params: { id: task.id } });
  };

  return (
    <TouchableOpacity
      style={[styles.taskItem, getStatusStyle(taskStatus)]}
      onPress={handleViewDetails}
    >
      <View style={styles.taskCardInfo}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.date}>{task.date}</Text>
        {/* Delete button with icon */}
        <IconButton
          icon="delete"
          iconColor={Colors.secondary}
          size={40}
          onPress={handleDelete}
        />
      </View>

      <View style={styles.taskCardButtons}>
        <Text
          style={{
            color: `${Colors.mainText}`,
            textAlign: "center",
          }}
        >
          Status:{" "}
          <Icon
            source={"circle"}
            size={15}
            color={getStatusColor(taskStatus)}
          />{" "}
          {taskStatus}
        </Text>
        {/* Status Menu */}
        <View style={styles.statusSelector}>
          <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
              <Button
                onPress={() => setVisible(true)}
                style={styles.menuButton}
              >
                Change Status
              </Button>
            }
          >
            <Menu.Item
              onPress={() => handleStatusChange("inProgress")}
              title="In Progress"
            />
            <Menu.Item
              onPress={() => handleStatusChange("completed")}
              title="Completed"
            />
            <Menu.Item
              onPress={() => handleStatusChange("canceled")}
              title="Canceled"
            />
          </Menu>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const getStatusColor = (status: string): string => {
  const style = getStatusStyle(status);
  const colorMatch = style.boxShadow.match(/rgba?\(([^)]+)\)/);
  return colorMatch ? `rgba(${colorMatch[1]})` : "";
};
// Добавление свечения карточке
const getStatusStyle = (status: string) => {
  switch (status) {
    case "completed":
      return {
        boxShadow: `0px 0px 30px ${Colors.taskItemCompleted}`,
      };
    case "inProgress":
      return {
        boxShadow: `0px 0px 30px ${Colors.taskItemInProgress}`,
      };
    case "canceled":
      return {
        boxShadow: `0px 0px 30px ${Colors.taskItemCanceled}`,
      };
    default:
      return {
        boxShadow: "0px 0px 30px rgba(233, 30, 99, 0.8)",
      };
  }
};

const styles = StyleSheet.create({
  taskItem: {
    width: "90%",
    padding: 20,
    marginBottom: 30,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}`,
    opacity: 0.9,
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
  },
  taskCardInfo: {
    flex: 1,
    maxWidth: 150,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    textAlign: "left",
  },
  taskCardButtons: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: `${Colors.mainText}`,
  },
  date: {
    color: `${Colors.additionalText}`,
    marginVertical: 5,
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
  },
});

export default TaskItem;

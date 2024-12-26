import { Task } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const tasks = await AsyncStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
};

export const saveTask = async (newTask: Task): Promise<Task[]> => {
  try {
    const currentTasks = await loadTasks();
    const updatedTasks = [...currentTasks, newTask];
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    return updatedTasks;
  } catch (error) {
    console.error("Error saving tasks:", error);
    return [];
  }
};

export const updateTaskStatus = async (taskId: string, status: string) => {
  try {
    const tasks = await loadTasks();
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status } : task
    );
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    return updatedTasks;
  } catch (error) {
    console.error("Error updating task status:", error);
    return [];
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const tasks = await loadTasks();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    return updatedTasks;
  } catch (error) {
    console.error("Error deleting task:", error);
    return [];
  }
};

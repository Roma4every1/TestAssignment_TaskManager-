import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button, Menu } from "react-native-paper";
import { Colors } from "@/constants/Colors";

interface StatusSelectorProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  currentStatus: string;
  setCurrentStatus: React.Dispatch<React.SetStateAction<string>>;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  visible,
  setVisible,
  currentStatus,
  setCurrentStatus,
}) => {
  return (
    <View style={styles.statusSelector}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button onPress={() => setVisible(true)} style={styles.menuButton}>
            {currentStatus}
          </Button>
        }
      >
        <Menu.Item onPress={() => setCurrentStatus("All")} title="All" />
        <Menu.Item
          onPress={() => setCurrentStatus("inProgress")}
          title="In Progress"
        />
        <Menu.Item
          onPress={() => setCurrentStatus("completed")}
          title="Completed"
        />
        <Menu.Item
          onPress={() => setCurrentStatus("canceled")}
          title="Canceled"
        />
      </Menu>
    </View>
  );
};

export default StatusSelector;

const styles = StyleSheet.create({
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

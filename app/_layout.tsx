// app/_layout.tsx
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { queryClient } from "@/store/storage";
import Toast from "react-native-toast-message";
import { Provider } from "react-native-paper";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="AddTask" options={{ headerShown: false }} />
          <Stack.Screen
            name="TaskDetail/[id]"
            options={{ headerShown: false }}
          />
        </Stack>
        <Toast />
      </Provider>
    </QueryClientProvider>
  );
}

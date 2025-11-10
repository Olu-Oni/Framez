import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{
        headerStyle: { backgroundColor: "transparent" }, 
        headerTitleAlign: "center",
        headerTintColor: "#41e8c0",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen 
        name="(auth)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        // options={{ headerShown: false }} 
      />
    </Stack>
  );
}
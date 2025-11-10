import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{
        headerStyle: { backgroundColor: "#1a2c33" },
        headerTintColor: "#41e8c0",
        headerTitleAlign: "center",
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ title: "Login" }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ title: "Sign Up" }} 
      />
    </Stack>
  );
}
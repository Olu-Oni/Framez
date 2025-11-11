import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const user = useQuery(api.lib.users.getCurrentUser);

  console.log("Auth State:", {
    loading: user === undefined,
    authenticated: user !== null,
    user: user,
  });

    // Already authenticated - redirect to feed
    if (user ) {
      return <Redirect href="/(tabs)" />;
    }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1a2c33" },
        headerTintColor: "#41e8c0",
        headerTitleAlign: "center",
        headerShown: false,
      }}
    >
      {/* <Stack.Protected guard={!user}> */}
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
      {/* </Stack.Protected> */}
    </Stack>
  );
}

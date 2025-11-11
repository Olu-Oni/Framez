import { ThemedMainContainer } from "@/components/ThemedComponents/Views";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";
export default function TabLayout() {
  //   const colorScheme = useColorScheme();
  const user = useQuery(api.lib.users.getCurrentUser);

  console.log("Auth State:", {
    loading: user === undefined,
    authenticated: user !== null,
    user: user,
  });
  
  // Loading state
  if (user === undefined) {
    return (
      <ThemedMainContainer className="items-center justify-center flex-1 bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#41e8c0" />
      </ThemedMainContainer>
    );
  }

  // Not authenticated - redirect to login
  if (user === null) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={
        {
          // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          // headerShown: false,
          // tabBarButton: HapticTab,
        }
      }
    >
      <Tabs.Protected guard={!!user}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Feed",
            //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}

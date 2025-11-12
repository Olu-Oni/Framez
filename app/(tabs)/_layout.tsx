import { ThemedMainContainer } from "@/components/ThemedComponents/Views";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Redirect, Tabs, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

export default function TabLayout() {
  const theme = useColorScheme()
  const user = useQuery(api.lib.users.getCurrentUser);
  const router = useRouter();

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
      screenOptions={{
        tabBarActiveTintColor: "#41e8c0",
        headerShown: true,
        headerStyle:{backgroundColor:theme==='dark'?'black':'white'}
        
      }}
    >
      <Tabs.Protected guard={!!user}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Feed",
            tabBarStyle:{backgroundColor:theme==='dark'?'black':'white',borderTopColor:theme==='dark'?'black':'white'},
            headerTitleAlign: "center",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => router.push("/(modals)/createPost")}
                style={styles.headerButton}
              >
                <Image
                  style={styles.icon}
                  source={require("@/assets/post-icon.png")}
                />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ color, focused }) => (
              <Image
                style={[styles.tabIcon, { tintColor: color }]}
                source={require("@/assets/post-icon.png")} // Add a home icon
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: "New Post",
            
            tabBarIcon: ({ color, focused }) => (
              <Image
                style={[
                  styles.tabIcon,
                  { tintColor: focused ? "#41e8c0" : color },
                ]}
                source={require("@/assets/post-icon.png")}
              />
            ),
          }}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              router.push("/(modals)/createPost");
            },
          })}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarStyle:{backgroundColor:theme==='dark'?'black':'white',borderTopColor:theme==='dark'?'black':'white'},
            
            tabBarIcon: ({ color, focused }) => (
              <Image
                style={[styles.tabIcon, { tintColor: color }]}
                source={require("@/assets/blank-avatar.png")}
              />
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain", // Better than borderRadius for icons
  },
  headerButton: {
    marginRight: 16,
    padding: 4, // Adds touchable area
  },
  tabIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});

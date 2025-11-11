import { ThemedButton } from "@/components/ThemedComponents/Buttons";
import {
  ThemedMainHeading,
  ThemedSubHeading,
} from "@/components/ThemedComponents/Texts";
import { ThemedMainContainer } from "@/components/ThemedComponents/Views";
import "@/global.css";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";

const Page = () => {
  return (
    <SafeAreaView className="mainContainer">
      <ThemedMainContainer>
        {/* Hero Section */}
        <View className="items-center justify-center flex-1 px-6">
          {/* Logo/Icon Placeholder */}
          {/* <View className="items-center justify-center w-24 h-24 mb-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <View className="items-center justify-center w-20 h-20 bg-white rounded-full dark:bg-gray-900">
              <ThemedMainHeading className="text-4xl">F</ThemedMainHeading>
            </View>
          </View> */}

          {/* Main Heading */}
          <View className="items-center gap-3 mb-20">
            <ThemedMainHeading className="text-center ">
              Welcome to
            </ThemedMainHeading>
            <ThemedSubHeading className="text-6xl font-black">
              Framez
            </ThemedSubHeading>
          </View>

          {/* Tagline */}
          <View className="px-8 mb-12">
            <ThemedSubHeading className="text-lg text-center">
              Capture moments, create memories, and share your story with the
              world
            </ThemedSubHeading>
          </View>

          {/* Feature Pills */}
          <View className="items-center gap-5 mb-16 md:flex-row">
            <View className="px-4 py-2 bg-white rounded-full dark:bg-gray-800">
              <ThemedSubHeading className="text-sm text-gray-700 dark:text-gray-300">
                📸 Easy Capture
              </ThemedSubHeading>
            </View>
            <View className="px-4 py-2 bg-white rounded-full dark:bg-gray-800">
              <ThemedSubHeading className="text-sm text-gray-700 dark:text-gray-300">
                ✨ User Friendly
              </ThemedSubHeading>
            </View>
            <View className="px-4 py-2 bg-white rounded-full dark:bg-gray-800">
              <ThemedSubHeading className="text-sm text-gray-700 dark:text-gray-300">
                🚀 Real Time updates
              </ThemedSubHeading>
            </View>
          </View>

          {/* CTA Button */}
          <View className="w-full px-8">
            <ThemedButton
              className="py-4 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600"
              href={"/(auth)/login"}
            >
              <ThemedSubHeading className="text-lg font-semibold text-center text-white">
                Get Started →
              </ThemedSubHeading>
            </ThemedButton>
          </View>

          {/* Bottom Text */}
          <View className="mt-8">
            <ThemedSubHeading className="text-sm text-center text-gray-500 dark:text-gray-500">
              Join thousands of creators today
            </ThemedSubHeading>
          </View>
        </View>

        {/* Decorative Bottom Sectpm */}
        <View className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
          {/* Add later */}
        </View>
      </ThemedMainContainer>
    </SafeAreaView>
  );
};

export default Page;

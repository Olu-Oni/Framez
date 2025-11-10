import { ThemedButton, ThemedLink } from "@/components/ThemedComponents/Buttons";
import { ThemedText } from "@/components/ThemedComponents/Texts";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from "react-native";


export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Add your login logic here
    console.log("Login:", { email, password });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView 
        contentContainerClassName="flex-grow"
        className="bg-[#1a2c33]"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-8">
            <ThemedText className="text-4xl font-bold text-white text-center mb-2">
              Welcome Back
            </ThemedText>
            <ThemedText className="text-[#b0c5cb] text-center">
              Sign in to continue
            </ThemedText>
          </View>

          {/* Form */}
          <View className="space-y-4 mb-6">
            {/* Email Input */}
            <View>
              <ThemedText className="text-[#b0c5cb] mb-2 ml-1">
                Email
              </ThemedText>
              <TextInput
                className="bg-[#3d5359] text-white px-4 py-3 rounded-lg"
                placeholder="Enter your email"
                placeholderTextColor="#7d9ca3"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View>
              <ThemedText className="text-[#b0c5cb] mb-2 ml-1">
                Password
              </ThemedText>
              <TextInput
                className="bg-[#3d5359] text-white px-4 py-3 rounded-lg"
                placeholder="Enter your password"
                placeholderTextColor="#7d9ca3"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Forgot Password */}
            {/* <View className="items-end">
              <ThemedLink onPress={() => console.log("Forgot password")}>
                Forgot Password?
              </ThemedLink>
            </View> */}
          </View>

          {/* Login Button */}
          <ThemedButton 
            variant="primary" 
            onPress={handleLogin}
            className="mb-4 p-3"
          >
            Login
          </ThemedButton>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-[1px] bg-[#3d5359]" />
            <ThemedText className="text-[#7d9ca3] mx-4">or</ThemedText>
            <View className="flex-1 h-[1px] bg-[#3d5359]" />
          </View>

          {/* Social Login Buttons */}
          <ThemedButton 
            variant="outline" 
            onPress={() => console.log("Google login")}
            className="mb-3 p-3"
          >
            Continue with Google
          </ThemedButton>

          {/* <ThemedButton 
            variant="outline" 
            onPress={() => console.log("Apple login")}
          >
            Continue with Apple
          </ThemedButton> */}

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center mt-8">
            <ThemedText className="text-[#b0c5cb] mr-2">
              Don't have an account?
            </ThemedText>
            <ThemedLink href="/(auth)/signup">
              Sign Up
            </ThemedLink>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
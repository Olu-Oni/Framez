import {
  ThemedButton,
  ThemedLink,
} from "@/components/ThemedComponents/Buttons";
import {
  ThemedMainHeading,
  ThemedText,
} from "@/components/ThemedComponents/Texts";
import { ThemedMainContainer } from "@/components/ThemedComponents/Views";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, TextInput, View } from "react-native";

// import * as z from "zod";

// const User = z.object({
//   email: z.email(),
// });

export default function Signup() {
  const router = useRouter();
  const { signIn } = useAuthActions();

  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignup = async () => {
    if (!fullName || !userName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (fullName.length < 2) {
      Alert.alert("Error", "Full name must be at least 2 characters");
      return;
    }

    if (userName.length < 3 || userName.length > 20) {
      Alert.alert("Error", "Username must be between 3 and 20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(userName)) {
      Alert.alert(
        "Error",
        "Username can only contain letters, numbers, and underscores"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (!/[0-9]/.test(password)) {
      Alert.alert("Error", "Password must contain at least one number");
      return;
    }

    setLoading(true);
    console.log({
        email,
        password,
        fullName,
        userName,
        flow: "signUp",
      })
    try {
      await signIn("password", {
        email,
        password,
        fullName,
        userName,
        flow: "signUp",
      });
      router.replace("/(tabs)"); // Navigate to main app
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert(
        "Signup Failed",
        "Unable to create account. Email may already be in use."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   className="flex-1"
    // >
    <ScrollView
      contentContainerClassName="flex-grow bg-white dark:bg-black"
      showsVerticalScrollIndicator={false}
      // className="bg-[#1a2c33]"
    >
      <ThemedMainContainer className="justify-center flex-1 px-6 py-12 ">
        {/* Header */}
        <View className="mb-8">
          <ThemedMainHeading className="mb-2 text-center">
            Create Account
          </ThemedMainHeading>
          <ThemedText className="text-center">
            Sign up to get started
          </ThemedText>
        </View>

        <View className="items-center justify-center gap-10 lg:flex-row">
          {/* Form */}
          <View className="self-center w-full max-w-lg gap-4 mb-6 ">
            {/* Full Name Input */}
            <View>
              <ThemedText className="textInputTitle">Full Name</ThemedText>
              <TextInput
                className="textInput"
                placeholder="Enter your full name (min. 2 characters)"
                placeholderTextColor="#7d9ca3"
                value={fullName}
                onChangeText={setFullName}
                editable={!loading}
                autoCapitalize="words"
              />
            </View>

            {/* User Name Input */}
            <View>
              <ThemedText className="textInputTitle">User Name</ThemedText>
              <TextInput
                className="textInput"
                placeholder="Enter username (3-20 chars, letters, numbers, _)"
                placeholderTextColor="#7d9ca3"
                value={userName}
                onChangeText={setUserName}
                editable={!loading}
                autoCapitalize="none"
              />
            </View>

            {/* Email Input */}
            <View>
              <ThemedText className="textInputTitle">Email</ThemedText>
              <TextInput
                className="textInput"
                placeholder="Enter your email"
                placeholderTextColor="#7d9ca3"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View>
              <ThemedText className="textInputTitle">Password</ThemedText>
              <TextInput
                className="textInput"
                placeholder="Create a password (min. 6 characters, must include a number)"
                placeholderTextColor="#7d9ca3"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Confirm Password Input */}
            <View>
              <ThemedText className="textInputTitle">
                Confirm Password
              </ThemedText>
              <TextInput
                className="textInput"
                placeholder="Confirm your password"
                placeholderTextColor="#7d9ca3"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
          </View>

{/* Buttons and Links section */}
          <View className="justify-center flex-1 w-full max-w-lg ">
            {/* Sign Up Button */}
            <ThemedButton
              variant="primary"
              onPress={handleSignup}
              className="flex-initial py-4 "
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
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
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Google signup will be available soon"
                )
              }
              className="flex-initial mb-3"
            >
              Continue with Google
            </ThemedButton>

            {/* Login Link */}
            <View className="flex-row items-center justify-center mt-8">
              <ThemedText className="mr-2">Already have an account?</ThemedText>
              <ThemedLink href="/(auth)/login">Login</ThemedLink>
            </View>
          </View>
        </View>
      </ThemedMainContainer>
    </ScrollView>
    // </KeyboardAvoidingView>
  );
}

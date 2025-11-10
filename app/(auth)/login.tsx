import {
  ThemedButton,
  ThemedLink,
} from "@/components/ThemedComponents/Buttons";
import {
  ThemedMainHeading,
  ThemedText
} from "@/components/ThemedComponents/Texts";
import { ThemedMainContainer } from "@/components/ThemedComponents/Views";
import { useAuthActions } from "@convex-dev/auth/react";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, TextInput, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signIn("password", { email, password, flow: "signIn" });
      router.replace("/(tabs)"); // Navigate to main app
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", "Invalid email or password");
    } finally {
      setLoading(false);

    }
  };

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    //   className="flex-1"
    // >
    // <ScrollView
    //   contentContainerClassName="flex-grow"
    //   className="bg-[#1a2c33]"
    // >
    <ThemedMainContainer className="justify-center flex-1 px-6 py-12 bg-white dark:bg-black">
      {/* Header */}
      <View className="mb-8">
        <ThemedMainHeading className="mb-2 text-center">
          Welcome Back
        </ThemedMainHeading>
        <ThemedText className="text-center ">Sign in to continue</ThemedText>
      </View>

      {/* Form */}
      <View className="mb-6">
        {/* Email Input */}
        <View className="mb-4">
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
          {/* <ThemedTextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#7d9ca3"
            editable={!loading}
          /> */}
        </View>

        {/* Password Input */}
        <View className="mb-4">
          <ThemedText className="textInputTitle">
            Password
          </ThemedText>
          <TextInput
            className="textInput"
            placeholder="Enter your password"
            placeholderTextColor="#7d9ca3"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>
      </View>

      {/* Login Button */}
      <ThemedButton
        variant="primary"
        onPress={handleLogin}
        className="mb-4"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
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
          Alert.alert("Coming Soon", "Google login will be available soon")
        }
        className="mb-3"
      >
        Continue with Google
      </ThemedButton>

      {/* Sign Up Link */}
      <View className="flex-row items-center justify-center mt-8">
        <ThemedText className="text-[#b0c5cb] mr-2">
          Don't have an account?
        </ThemedText>
        <ThemedLink href="/(auth)/signup">Sign Up</ThemedLink>
      </View>
      <Link className="mt-10 text-white max-w-fit" href="/">
        Home
      </Link>
    </ThemedMainContainer>
    // </ScrollView>
    // </KeyboardAvoidingView>
  );
}

import { ThemedButton } from "@/components/ThemedComponents/Buttons";
import {
  ThemedMainHeading,
  ThemedText,
} from "@/components/ThemedComponents/Texts";
import { ThemedMainContainer } from "@/components/ThemedComponents/Views";
import { Post } from "@/convex/schema";
import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type newPost = Omit<
  Post,
  "userId" | "createdAt" | "likes" | "userName" | "userAvatar"
>;
export default function createPostModal() {
  const isPresented = router.canGoBack();
  // const [post, setPost] = useState<newPost>({
  // content: "",
  // imageUrls: []
  // });
  const [postContent, setPostContent] = useState<string>("");
  const [postImages, setImages] = useState<String[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreation = () => {
    setIsLoading(true);
    console.log("creating");
  };
  return (
    <View className="flex-1 p-4 mainContainer">
      {/* {isPresented && ( */}
      <Link href="../" className="dark:fill-[#41e8c0] ml-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          fill="inherit"
          width="30"
          height="30"
          viewBox="0 0 50 50"
        >
          <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
        </svg>
      </Link>
      {/* )} */}
      <ThemedMainContainer>
        <ThemedMainHeading>Create a new Post</ThemedMainHeading>
        {/* Content Input */}
        <View className="max-w-xl mb-4">
          <ThemedText className="textInputTitle">Content</ThemedText>
          <TextInput
            className="textInput"
            placeholder="Enter your content here..."
            placeholderTextColor="#7d9ca3"
            value={postContent}
            onChangeText={setPostContent}
            secureTextEntry
            editable={!isLoading}
          />
        </View>
        {/* Image Dropzone */}
        <View className="mb-4">Image goes here...</View>

        {/* Login Button */}
        <ThemedButton
          variant="primary"
          onPress={handleCreation}
          className="mb-4"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "CreatePost"}
        </ThemedButton>
      </ThemedMainContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});

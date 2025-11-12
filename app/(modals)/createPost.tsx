import PostImageCarousel from "@/components/Carousel";
import { ThemedButton } from "@/components/ThemedComponents/Buttons";
import {
  ThemedMainHeading,
  ThemedSubHeading2,
  ThemedText,
} from "@/components/ThemedComponents/Texts";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreatePost() {
  const isPresented = router.canGoBack();
  const [postContent, setPostContent] = useState<string>("");
  const [postImages, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createPost = useMutation(api.lib.posts.createPost);

  const removeImage = (indexToRemove: number) => {
    setImages(postImages.filter((_, index) => index !== indexToRemove));
  };

  const handleCreation = async () => {
    if (!postContent.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await createPost({
        content: postContent.trim(),
        imageUrls: postImages,
      });
      // Reset form and navigate back
      setPostContent("");
      setImages([]);
      router.back();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const takeImage = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera Permission Required",
        "Please grant camera permissions in your device settings to take photos."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7, // Reduced from 1.0 for better file size (0.7 = 70% quality)
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      // Limit image dimensions to prevent huge files
      // Most social media apps use max 1080-1920px width
      const maxWidth = 1920;
      const maxHeight = 1920;

      // If image is larger than max dimensions, we'd need expo-image-manipulator
      // For now, quality reduction helps significantly
      if (asset.width && asset.height) {
        // Log for debugging
        console.log(`Image dimensions: ${asset.width}x${asset.height}`);
      }

      setImages([...postImages, asset.uri]);
    }
  };

  const uploadImage = async () => {
    // Request media library permissions
    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (status !== "granted") {
    //   Alert.alert(
    //     "Photo Library Permission Required",
    //     "Please grant photo library permissions in your device settings to upload images."
    //   );
    //   return;
    // }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      allowsMultipleSelection: false,
      // Platform-specific optimizations
      ...(Platform.OS === "ios" && {
        // iOS-specific options
        exif: false, // Remove EXIF data to reduce file size
      }),
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      // Check file size if available (some platforms provide this)
      if (asset.fileSize) {
        const maxSizeMB = 10; // 10MB limit
        const fileSizeMB = asset.fileSize / (1024 * 1024);

        if (fileSizeMB > maxSizeMB) {
          Alert.alert(
            "Image Too Large",
            `Image is ${fileSizeMB.toFixed(1)}MB. Please choose a smaller image (max ${maxSizeMB}MB).`
          );
          return;
        }
      }

      // Log for debugging
      if (asset.width && asset.height) {
        console.log(`Image dimensions: ${asset.width}x${asset.height}`);
      }

      setImages([...postImages, asset.uri]);
    }
  };

  return (
    <ScrollView className="flex-1 mainContainer">
      <Pressable className="flex-1" onPress={Keyboard.dismiss}>
        <View className="items-center flex-1 p-10 pl-4">
          {isPresented && (
            <View className="mb-4 ml-auto">
              <Link href="../" asChild>
                <TouchableOpacity>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
          <View className="w-full max-w-xl border-l-4 border-[#41e8c0] pl-6 rounded-xl">
            <ThemedMainHeading className="mb-10">
              Create a new Post
            </ThemedMainHeading>
            {/* Content Input */}
            <View className="max-w-xl mb-4">
              <ThemedText className="textInputTitle">Content</ThemedText>
              <TextInput
                className="textInput"
                placeholder="Enter your content here..."
                placeholderTextColor="#7d9ca3"
                value={postContent}
                onChangeText={setPostContent}
                multiline
                numberOfLines={4}
                editable={!isLoading}
              />
            </View>
            {/* Image Dropzone */}
            <View className="gap-4 my-10">
              <View className="flex-col justify-between w-full gap-3">
                <ThemedButton
                  variant="outline"
                  className="flex-none border-dashed"
                  onPress={uploadImage}
                >
                  Upload an image
                </ThemedButton>
                {Platform.OS !== "web" && (
                  <ThemedButton
                    variant="secondary"
                    onPress={takeImage}
                    className="flex-none "
                  >
                    use camera
                  </ThemedButton>
                )}
              </View>
              {postImages.length > 0 && (
                <View className="w-full mt-3">
                  <ThemedSubHeading2 className="mb-3 text-xl font-bold">
                    Preview {postImages.length > 1 && `(${postImages.length})`}:
                  </ThemedSubHeading2>
                  <View className="gap-3">
                    <PostImageCarousel
                      imageUrls={postImages}
                      containerPadding={4}
                      maxWidth={600}
                      deleteFunction={removeImage}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Login Button */}
            <ThemedButton
              variant="primary"
              onPress={handleCreation}
              className="mb-4"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Post"}
            </ThemedButton>
          </View>

          {/* To be added: Preview posts */}
        </View>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  closeButton: {
    fontSize: 32,
    color: "#41e8c0",
    fontWeight: "300",
    lineHeight: 30,
    width: 30,
    height: 30,
    textAlign: "center",
    marginTop: 40,
  },
});

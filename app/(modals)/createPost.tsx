import PostImageCarousel from "@/components/Carousel";
import { ThemedButton } from "@/components/ThemedComponents/Buttons";
import {
  ThemedMainHeading,
  ThemedSubHeading2,
  ThemedText,
} from "@/components/ThemedComponents/Texts";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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
  // const [postImages, setImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // For UI
  const [imageFiles, setImageFiles] = useState<
    {
      uri: string;
      type: string;
      name: string;
    }[]
  >([]); // For upload
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateUploadUrl = useMutation(api.lib.images.generateUploadUrl);

  const createPost = useMutation(api.lib.posts.createPost);

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreation = async () => {
    if (!postContent.trim()) return;

    setIsLoading(true);
    try {
      const uploadedStorageIds: Id<"_storage">[] = [];

      // Upload each image
      for (const file of imageFiles) {
        const uploadUrl = await generateUploadUrl();

        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": file.type,
          },
          body: { uri: file.uri, type: file.type, name: file.name } as any,
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Upload failed: ${error}`);
        }

        const { storageId } = await response.json();
        uploadedStorageIds.push(storageId);
      }

      // Create post with storage IDs
      await createPost({
        content: postContent.trim(),
        imageUrls: uploadedStorageIds, // Convex storage IDs
      });

      // Reset
      setPostContent("");
      setImageFiles([]);
      setPreviewUrls([]);
      router.back();
    } catch (error: any) {
      console.error("Post creation failed:", error);
      Alert.alert("Error", error.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const takeImage = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera access is needed.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const file = {
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `photo-${Date.now()}.jpg`,
      };

      setImageFiles((prev) => [...prev, file]);
      setPreviewUrls((prev) => [...prev, asset.uri]);
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const file = {
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `image-${Date.now()}.jpg`,
      };

      setImageFiles((prev) => [...prev, file]);
      setPreviewUrls((prev) => [...prev, asset.uri]);
    }
  };

  return (
    <ScrollView className="flex-1 mainContainer">
      <Pressable className="flex-1" onPress={Platform.OS !== "web" ? Keyboard.dismiss : undefined}>
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
              {previewUrls.length > 0 && (
                <View className="w-full mt-3">
                  <ThemedSubHeading2 className="mb-3 text-xl font-bold">
                    Preview ({previewUrls.length}):
                  </ThemedSubHeading2>
                  <PostImageCarousel
                    imageUrls={previewUrls}
                    containerPadding={4}
                    maxWidth={600}
                    deleteFunction={removeImage}
                  />
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

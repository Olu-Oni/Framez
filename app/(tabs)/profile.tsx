import PostImageCarousel from "@/components/Carousel";
import { ThemedButton } from "@/components/ThemedComponents/Buttons";
import {
  ThemedMainHeading,
  ThemedSubHeading2,
  ThemedText,
} from "@/components/ThemedComponents/Texts";
import { ThemedMainContainer } from "@/components/ThemedComponents/Views";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.lib.users.getCurrentUser);
  const userPosts = useQuery(api.lib.posts.getUserPosts);
  const updateProfile = useMutation(api.lib.users.updateProfile);
  const deletePost = useMutation(api.lib.posts.deletePost);
  const updatePost = useMutation(api.lib.posts.updatePost);
  const generateUploadUrl = useMutation(api.lib.images.generateUploadUrl);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit post modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]); // Preview URLs
  const [originalImageIds, setOriginalImageIds] = useState<Id<"_storage">[]>(
    []
  );
  const [editImageFiles, setEditImageFiles] = useState<
    {
      uri: string;
      type: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || "");
      setUserName(currentUser.userName || "");
      setAvatarUrl(currentUser.userAvatar || "");
    }
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);

    try {
      let avatarStorageId: Id<"_storage"> | undefined = undefined;

      console.log("old storageId", avatarStorageId);
      // Upload avatar if a new one was selected
      if (selectedAvatarFile) {
        const generatedUrl = await generateUploadUrl();
        console.log("gen url:", generatedUrl);

        // Fetch the image file from the URI
        const response = await fetch(selectedAvatarFile.uri);
        const blob = await response.blob();
        console.log("selected image", blob);

        // Upload to Convex
        const uploadResult = await fetch(generatedUrl, {
          method: "POST",
          headers: { "Content-Type": selectedAvatarFile.type || "image/jpeg" },
          body: blob,
        });

        if (!uploadResult.ok) {
          const errorText = await uploadResult.text(); // Read error as text
          console.error("Upload failed:", uploadResult.status, errorText);
          throw new Error(`Upload failed: ${errorText}`);
        }

        const { storageId } = await uploadResult.json();
        console.log("new storageId", storageId);
        avatarStorageId = storageId;
      }

      // Update profile with all fields
      await updateProfile({
        fullName: fullName.trim() || undefined,
        userName: userName.trim() || undefined,
        avatarStorageId: avatarStorageId,
      });

      setIsEditing(false);
      setSelectedAvatarFile(null);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePost = async (postId: Id<"posts">) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost({ postId });
            Alert.alert("Success", "Post deleted successfully!");
          } catch (error) {
            console.error("Error deleting post:", error);
            Alert.alert("Error", "Failed to delete post");
          }
        },
      },
    ]);
  };

  const openEditModal = (post: any) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditImages(post.imageUrls || []);
    setOriginalImageIds(post.imageStorageIds || []);
    setEditImageFiles([]);
    setEditModalVisible(true);
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    setIsUpdating(true);
    try {
      const newStorageIds: Id<"_storage">[] = [];

      // Upload new images
      for (const file of editImageFiles) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: { uri: file.uri, type: file.type, name: file.name } as any,
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Upload failed: ${error}`);
        }

        const { storageId } = await response.json();
        newStorageIds.push(storageId);
      }

      const finalImageIds = [...originalImageIds, ...newStorageIds];

      await updatePost({
        postId: editingPost._id,
        content: editContent.trim(),
        imageUrls: finalImageIds,
      });

      setEditModalVisible(false);
      Alert.alert("Success", "Post updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update post");
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadAvatarImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      setAvatarUrl(asset.uri);
      setSelectedAvatarFile({
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || "avatar.jpg",
      });
    }
  };

  const uploadEditImage = async () => {
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
        name: asset.fileName || `edit-${Date.now()}.jpg`,
      };

      setEditImageFiles((prev) => [...prev, file]);
      setEditImages((prev) => [...prev, asset.uri]);
    }
  };

  const removeEditImage = (index: number) => {
    setEditImages((prev) => prev.filter((_, i) => i !== index));
    setEditImageFiles((prev) => prev.filter((_, i) => i !== index));
    setOriginalImageIds((prev) => prev.filter((_, i) => i !== index));
  };

  if (currentUser === undefined || userPosts === undefined) {
    return (
      <ThemedMainContainer className="items-center justify-center mainContainer">
        <ActivityIndicator size="large" color="#41e8c0" />
      </ThemedMainContainer>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="dark:bg-black">
      <ThemedMainContainer className="p-4">
        <View className="items-center flex-1">
          {/* Profile Header */}
          <View className="w-full max-w-[640px] p-6 bg-white dark:bg-slate-950 rounded-md mb-4">
            <View className="items-center mb-6">
              <TouchableOpacity
                onPress={isEditing ? uploadAvatarImage : undefined}
                disabled={!isEditing}
              >
                <Image
                  alt="profile avatar"
                  className="dark:bg-white"
                  source={
                    avatarUrl
                      ? { uri: avatarUrl }
                      : require("@/assets/blank-avatar.png")
                  }
                  style={styles.largeAvatar}
                />
                {isEditing && (
                  <View style={styles.editBadge}>
                    <Image
                      alt="upload photo"
                      // className="dark:bg-white"

                      source={require("@/assets/camera-icon.png")}
                      style={styles.icons}
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View className="gap-4 mb-4">
                <View>
                  <ThemedText className="mb-2 font-semibold">
                    Full Name
                  </ThemedText>
                  <TextInput
                    className="textInput"
                    placeholder="Enter your full name"
                    placeholderTextColor="#7d9ca3"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
                <View>
                  <ThemedText className="mb-2 font-semibold">
                    Username
                  </ThemedText>
                  <TextInput
                    className="textInput"
                    placeholder="Enter your username"
                    placeholderTextColor="#7d9ca3"
                    value={userName}
                    onChangeText={setUserName}
                  />
                </View>
                <View className="flex-row gap-2 mt-2">
                  <ThemedButton
                    variant="primary"
                    onPress={handleUpdateProfile}
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </ThemedButton>
                  <ThemedButton
                    variant="outline"
                    onPress={() => {
                      setIsEditing(false);
                      setSelectedAvatarFile(null);
                      // Reset to original values
                      if (currentUser) {
                        setFullName(currentUser.fullName || "");
                        setUserName(currentUser.userName || "");
                        setAvatarUrl(currentUser.userAvatar || "");
                      }
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </ThemedButton>
                </View>
              </View>
            ) : (
              <View className="items-center gap-2 mb-4">
                <ThemedMainHeading>{fullName || "No Name"}</ThemedMainHeading>
                <ThemedText className="text-lg opacity-70">
                  @{userName || "no_username"}
                </ThemedText>
                <ThemedButton
                  variant="secondary"
                  onPress={() => setIsEditing(true)}
                  className="mt-4"
                >
                  Edit Profile
                </ThemedButton>
              </View>
            )}

            <ThemedButton
              variant="red"
              onPress={() => signOut()}
              className="mt-2"
            >
              Sign out
            </ThemedButton>
          </View>

          {/* User Posts Section */}
          <View className="w-full max-w-[640px]">
            <ThemedSubHeading2 className="mb-4 text-2xl font-bold">
              My Posts ({userPosts?.length || 0})
            </ThemedSubHeading2>

            {userPosts && userPosts.length === 0 ? (
              <View className="items-center p-10 bg-white rounded-md dark:bg-slate-950">
                <ThemedText className="mb-4 text-lg opacity-70">
                  No posts yet
                </ThemedText>
                <ThemedButton
                  variant="primary"
                  onPress={() => router.push("/(modals)/createPost")}
                >
                  Create Your First Post
                </ThemedButton>
              </View>
            ) : (
              <View className="gap-3">
                {userPosts?.map((post, index) => (
                  <View
                    className="w-full px-4 py-4 bg-white rounded-md dark:bg-slate-950"
                    key={`${post._id}-${index}`}
                  >
                    {/* Post Header */}
                    <View style={styles.postHeader}>
                      <ThemedText style={styles.timestamp}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </ThemedText>
                      <View style={styles.postActions}>
                        <TouchableOpacity onPress={() => openEditModal(post)}>
                          <Image
                            alt="edit post"
                            // className="dark:bg-white"
                            source={require("@/assets/edit-icon.png")}
                            style={styles.icons}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeletePost(post._id)}
                        >
                          <Image
                            alt="delete"
                            // className="dark:bg-white"
                            source={require("@/assets/trash-icon.png")}
                            style={styles.icons}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Post Content */}
                    <ThemedText style={styles.content}>
                      {post.content}
                    </ThemedText>

                    {/* Post Images */}
                    {post.imageUrls && post.imageUrls.length > 0 && (
                      <PostImageCarousel imageUrls={post.imageUrls} />
                    )}

                    {/* Likes */}
                    <View className="mt-3">
                      <ThemedText style={styles.likes}>
                        ❤️ {post.likes || 0} likes
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Edit Post Modal */}
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <ScrollView className="flex-1 mainContainer">
            <View className="items-center flex-1 p-10 pl-4">
              <View className="mb-4 ml-auto">
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <ThemedText style={styles.closeButton}>✕</ThemedText>
                </TouchableOpacity>
              </View>

              <View className="w-full max-w-xl border-l-4 border-[#41e8c0] pl-6 rounded-xl">
                <ThemedMainHeading className="mb-10">
                  Edit Post
                </ThemedMainHeading>

                <View className="max-w-xl mb-4">
                  <ThemedText className="textInputTitle">Content</ThemedText>
                  <TextInput
                    className="textInput"
                    placeholder="Enter your content here..."
                    placeholderTextColor="#7d9ca3"
                    value={editContent}
                    onChangeText={setEditContent}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View className="gap-4 my-6">
                  <ThemedButton
                    variant="outline"
                    className="border-dashed"
                    onPress={uploadEditImage}
                  >
                    Add Image
                  </ThemedButton>

                  {editImages.length > 0 && (
                    <View className="mt-3">
                      <ThemedSubHeading2 className="mb-3">
                        Images ({editImages.length}):
                      </ThemedSubHeading2>
                      <PostImageCarousel
                        imageUrls={editImages}
                        containerPadding={4}
                        maxWidth={600}
                        deleteFunction={removeEditImage}
                      />
                    </View>
                  )}
                </View>

                <View className="flex-row gap-2">
                  <ThemedButton
                    variant="primary"
                    onPress={handleUpdatePost}
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    {isUpdating ? "Updating..." : "Update Post"}
                  </ThemedButton>
                  <ThemedButton
                    variant="outline"
                    onPress={() => setEditModalVisible(false)}
                    className="flex-1"
                  >
                    Cancel
                  </ThemedButton>
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </ThemedMainContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  icons: {
    width: 30,
    height: 30,
  },
  largeAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#41e8c0",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  editBadgeText: {
    fontSize: 20,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  postActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    fontSize: 20,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  likes: {
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    fontSize: 32,
    color: "#41e8c0",
    fontWeight: "300",
    lineHeight: 30,
    width: 30,
    height: 30,
    textAlign: "center",
    marginTop:10,
  },
});

export default Profile;

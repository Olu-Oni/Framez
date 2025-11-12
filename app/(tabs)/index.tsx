import PostImageCarousel from "@/components/Carousel";
import { ThemedButton } from "@/components/ThemedComponents/Buttons";
import { ThemedText } from "@/components/ThemedComponents/Texts";
import { ThemedMainContainer } from "@/components/ThemedComponents/Views";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const Feed = () => {
  const posts = useQuery(api.lib.posts.getPosts);

  // Loading state
  if (posts === undefined) {
    return (
      <ThemedMainContainer className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#41e8c0" />
      </ThemedMainContainer>
    );
  }
  // Empty state
  if (posts.length == 0) {
    return (
      <ThemedMainContainer className="items-center justify-center flex-1 gap-10 p-10">
        <ThemedText className="text-2xl font-bold">No posts found</ThemedText>
        <ThemedButton
          variant="primary"
          onPress={() => router.push("/(modals)/createPost")}
        >
          Create Post
        </ThemedButton>
      </ThemedMainContainer>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className=" dark:bg-black">
      <ThemedMainContainer className="p-4 ">
        {/* Post Container */}
        <View className="items-center flex-1 gap-3">
          {posts?.map(
            (
              post,
              index // Changed 'posts' to 'post' and added index
            ) => (
              <View
                className="max-w-[640px] w-full px-1 py-4 bg-white dark:bg-slate-950   rounded-md"
                key={`${post.userId}-${index}`}
              >
                {/* Profile Header */}
                <View style={styles.headerContainer}>
                  <Image
                    alt="profile icon"
                    className="dark:bg-white"
                    source={
                      post.userAvatar
                        ? { uri: post.userAvatar }
                        : require("@/assets/blank-avatar.png")
                    }
                    style={styles.avatar}
                  />
                  <View style={styles.userInfo}>
                    <ThemedText style={styles.userName}>
                      {post.userName}
                    </ThemedText>
                    <ThemedText style={styles.timestamp}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </ThemedText>
                  </View>
                </View>
                {/* Post Content */}
                <ThemedText style={styles.content}>{post.content}</ThemedText>
                {/* Post Images */}
                {post.imageUrls && post.imageUrls.length > 0 && (
                  <PostImageCarousel imageUrls={post.imageUrls} />
                )}
                {/* Likes and comments*/}
                <View className="flex-row justify-between mx-3">
                  <ThemedText style={styles.comments}>
                    ❤️ {post.likes} likes
                  </ThemedText>
                  <ThemedText >
                   {(Math.random()*100).toFixed(0)} {" "}comments {/* ❤️ {post.comments || ""} likes */}
                  </ThemedText>
                </View>
              </View>
            )
          )}
        </View>
      </ThemedMainContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    marginLeft: 4,
  },
  likes: {
    fontSize: 14,
    fontWeight: "600",
    marginInlineStart: 10,
  },
  comments: {},
});

export default Feed;

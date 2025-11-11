import { ThemedText } from "@/components/ThemedComponents/Texts";
import {
  ThemedCard,
  ThemedMainContainer,
} from "@/components/ThemedComponents/Views";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

// Define the Post type
type Post = {
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  imageUrls?: string[];
  createdAt: number;
  likes: number;
};

const index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    // Only set posts once when component mounts
    setPosts([
      {
        userId: "k17d9g3h8n7m6p5q4r3s2t1u",
        userName: "Sarah Johnson",
        userAvatar: "https://example.com/avatars/sarah-johnson.jpg",
        content: "Just finished building my first React Native app! 🚀 The journey from idea to deployment was challenging but incredibly rewarding. Special thanks to the amazing dev community for all the support along the way. #ReactNative #MobileDev",
        imageUrls: [
          "https://example.com/posts/app-screenshot-1.jpg",
          "https://example.com/posts/app-screenshot-2.jpg"
        ],
        createdAt: 1699704000000,
        likes: 42
      },
      {
        userId: "k17d9g3h8n7m6p5q4r3s2t1u",
        userName: "Mike Chen",
        content: "Coffee and code - the perfect Sunday morning combo ☕",
        createdAt: 1699790400000,
        likes: 15
      }
    ]);
  }, []); // Empty dependency array - runs only once

  return (
    <ScrollView>
      <ThemedMainContainer className="gap-1 p-2">
        {posts.map((post, index) => ( // Changed 'posts' to 'post' and added index
          <ThemedCard key={`${post.userId}-${index}`}> {/* Added unique key */}
            {/* Profile Header */}
            <View style={styles.headerContainer}>
              <Image
                source={
                  post.userAvatar 
                    ? { uri: post.userAvatar }
                    : require("@/assets/blank-avatar.png")
                }
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <ThemedText style={styles.userName}>{post.userName}</ThemedText>
                <ThemedText style={styles.timestamp}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </ThemedText>
              </View>
            </View>

            {/* Post Content */}
            <ThemedText style={styles.content}>{post.content}</ThemedText>

            {/* Post Images */}
            {post.imageUrls && post.imageUrls.length > 0 && (
              <View style={styles.imagesContainer}>
                {post.imageUrls.map((url, imgIndex) => (
                  <Image
                    key={imgIndex}
                    source={{ uri: url }}
                    style={styles.postImage}
                  />
                ))}
              </View>
            )}

            {/* Likes */}
            <ThemedText style={styles.likes}>❤️ {post.likes} likes</ThemedText>
          </ThemedCard>
        ))}
      </ThemedMainContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  },
  imagesContainer: {
    marginBottom: 12,
    gap: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  likes: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default index;
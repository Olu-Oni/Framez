import { ThemedText } from "@/components/ThemedComponents/Texts";
import {
  ThemedCard,
  ThemedMainContainer,
} from "@/components/ThemedComponents/Views";
import React, { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";

import Carousel from "react-native-reanimated-carousel";

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

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Only set posts once when component mounts
    setPosts([
      {
        userId: "k17d9g3h8n7m6p5q4r3s2t1u",
        userName: "Sarah Johnson",
        userAvatar: "https://example.com/avatars/sarah-johnson.jpg",
        content:
          "Just finished building my first React Native app! 🚀 The journey from idea to deployment was challenging but incredibly rewarding. Special thanks to the amazing dev community for all the support along the way. #ReactNative #MobileDev",
        imageUrls: [
          "https://images.unsplash.com/photo-1760835386810-fdf83a55ff5e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=400",
          "https://images.unsplash.com/photo-1731090012493-186a21354fd0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=400",
        ],
        createdAt: 1699704000000,
        likes: 42,
      },
      {
        userId: "k17d9g3h8n7m6p5q4r3s2t1u",
        userName: "Mike Chen",
        content: "Coffee and code - the perfect Sunday morning combo ☕",
        createdAt: 1699790400000,
        likes: 15,
      },
    ]);
  }, []); // Empty dependency array - runs only once

  return (
    <ScrollView>
      <ThemedMainContainer className="gap-1 p-2">
        {posts.map(
          (
            post,
            index // Changed 'posts' to 'post' and added index
          ) => (
            <ThemedCard key={`${post.userId}-${index}`}>
              {" "}
              {/* Added unique key */}
              {/* Profile Header */}
              <View style={styles.headerContainer}>
                <Image
                  alt="profile icon"
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
              {/* Likes */}
              <ThemedText style={styles.likes}>
                ❤️ {post.likes} likes
              </ThemedText>
            </ThemedCard>
          )
        )}
      </ThemedMainContainer>
    </ScrollView>
  );
};

function PostImageCarousel({ imageUrls }: { imageUrls: string[] }) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const itemWidth = useMemo(() => Math.min(width, 800), [width]);

  return (
    <View style={[styles.carouselContainer, { width: "100%" }]}>
      <Carousel
        width={itemWidth}
        height={200}
        data={imageUrls}
        loop={false}
        pagingEnabled
        onSnapToItem={setActiveIndex}
        renderItem={({ item }: { item: string }) => (
          <View style={{ width: itemWidth }}>
            <Image source={{ uri: item }} style={[styles.postImage]} />
          </View>
        )}
      />

      <View style={styles.dotsContainer}>
        {imageUrls.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

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
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  carouselContainer: {
    marginBottom: 12,
  },
  dotsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 8,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: "#41e8c0",
  },
  dotInactive: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  likes: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Feed;

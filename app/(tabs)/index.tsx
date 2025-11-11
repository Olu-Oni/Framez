import { ThemedText } from "@/components/ThemedComponents/Texts";
import {
  ThemedCard,
  ThemedMainContainer,
} from "@/components/ThemedComponents/Views";
import { Post } from "@/convex/schema";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";

import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

// Define the Post type


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
    <ScrollView showsVerticalScrollIndicator={false}>
      <ThemedMainContainer className="p-2">
        {/* Post Container */}
        <View className="items-center flex-1 gap-1">
          {posts.map(
            (
              post,
              index // Changed 'posts' to 'post' and added index
            ) => (
              <ThemedCard key={`${post.userId}-${index}`}>
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
        </View>
      </ThemedMainContainer>
    </ScrollView>
  );
};

function PostImageCarousel({ imageUrls }: { imageUrls: string[] }) {
  const { width } = useWindowDimensions();
  const itemWidth = useMemo(() => Math.min(width - 50, 600), [width - 50]);
  const [activeIndex, setActiveIndex] = useState(0);
  // const itemWidth = Dimensions.get("window").width ;
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View
      style={[styles.carouselContainer, { width: "100%" }]}
      className="self-center mx-auto"
    >
      <Carousel
        width={itemWidth}
        height={itemWidth / 1.5}
        data={imageUrls}
        loop={false}
        onProgressChange={progress}
        pagingEnabled
        // onSnapToItem={setActiveIndex}
        renderItem={({ item }: { item: string }) => (
          <View
            style={{
              flex: 1,
              // borderWidth: 1,
              justifyContent: "center",
              padding: 4,
            }}
          >
            <Image source={{ uri: item }} style={[styles.postImage]} />
          </View>
        )}
      />

      <Pagination.Basic
        progress={progress}
        data={imageUrls}
        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
        activeDotStyle={{ backgroundColor: "#41e8c0", borderRadius: 50 }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        onPress={onPressPagination}
      />
    </View>
  );
}

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
  },
  postImage: {
    width: "100%",
    height: 300,
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

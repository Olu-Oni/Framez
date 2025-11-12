import React, { useMemo, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";

import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

interface PostImageCarouselProps {
  deleteFunction?: (index: number) => void;
  imageUrls: string[];
  containerPadding?: number; // Horizontal padding to account for
  maxWidth?: number; // Maximum width constraint
  aspectRatio?: number; // Height = width / aspectRatio (default 1.5)
}

export default function PostImageCarousel({
  deleteFunction,
  imageUrls,
  containerPadding = 0,
  maxWidth,
  aspectRatio = 1.5,
}: PostImageCarouselProps) {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

  const itemWidth = useMemo(() => {
    if (containerWidth === 0) return 300; // Fallback while measuring

    // Calculate available width accounting for padding
    const availableWidth = containerWidth - containerPadding * 2;

    // Apply max width constraint if provided
    const calculatedWidth = maxWidth
      ? Math.min(availableWidth, maxWidth)
      : availableWidth;

    return Math.max(calculatedWidth, 200); // Minimum width of 200
  }, [containerWidth, containerPadding, maxWidth]);

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
      onLayout={onLayout}
    >
      {containerWidth > 0 && (
        <>
          <Carousel
            ref={ref}
            width={itemWidth}
            height={itemWidth / aspectRatio}
            data={imageUrls}
            loop={false}
            onProgressChange={progress}
            pagingEnabled
            renderItem={({ item }: { item: string }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  padding: 4,
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={[
                    styles.postImage,
                    {
                      width: itemWidth - 8, // Account for padding
                      height: itemWidth / aspectRatio - 8,
                    },
                  ]}
                />
                {deleteFunction && (
                  <TouchableOpacity
                    onPress={() =>
                      deleteFunction && deleteFunction(imageUrls.indexOf(item))
                    }
                    style={styles.deleteButton}
                    className="absolute top-2 right-2"
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
          {imageUrls.length > 1 && (
            <Pagination.Basic
              progress={progress}
              data={imageUrls}
              dotStyle={{ backgroundColor: "#e2e8f0", borderRadius: 50 }}
              activeDotStyle={{ backgroundColor: "#41e8c0", borderRadius: 50 }}
              containerStyle={{ gap: 5, marginTop: 10 }}
              onPress={onPressPagination}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  postImage: {
    borderRadius: 8,
    resizeMode: "cover",
  },
  carouselContainer: {
    marginBottom: 12,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    margin: 4,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 20,
  },
});

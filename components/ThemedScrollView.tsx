import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";

export default function ThemedScrollView({
  children,
  ...props
}: PropsWithChildren<Omit<ComponentPropsWithoutRef<Animated.ScrollView>, "children">>) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} {...props}>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.small,
    gap: 16,
    overflow: "hidden",
  },
});

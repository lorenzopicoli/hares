import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/hooks/useBottomTabOverflow";
import { Sizes } from "@/constants/Sizes";

export default function ThemedScrollView({
  children,
  ...props
}: PropsWithChildren<Omit<ComponentPropsWithoutRef<Animated.ScrollView>, "children">>) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const bottom = useBottomTabOverflow();
  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
        {...props}
      >
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
    padding: Sizes.scrollView.padding,
    gap: 16,
    overflow: "hidden",
  },
});

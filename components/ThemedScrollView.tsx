import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";

interface ThemedScrollViewProps
  extends PropsWithChildren<Omit<ComponentPropsWithoutRef<Animated.ScrollView>, "children">> {
  contentStyle?: StyleProp<ViewStyle>;
}

export default function ThemedScrollView({ children, contentStyle, ...props }: ThemedScrollViewProps) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} {...props}>
        <ThemedView style={[styles.content, contentStyle]}>{children}</ThemedView>
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
    paddingHorizontal: Sizes.medium,
    gap: 16,
    overflow: "hidden",
  },
});

import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";

type StackProps = {
  children: React.ReactNode;
  gap?: number;
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
  flexWrap?: "wrap" | "nowrap" | "wrap-reverse";
  style?: StyleProp<ViewStyle>;
};

export function YStack({
  children,
  gap = Sizes.medium,
  alignItems = "flex-start",
  justifyContent = "flex-start",
  flexWrap,
  style,
}: StackProps) {
  const { styles } = useStyles(createYStackStyles);

  return <View style={[styles.container, { gap }, { alignItems, justifyContent, flexWrap }, style]}>{children}</View>;
}

export function XStack({
  children,
  gap = Sizes.medium,
  alignItems = "center",
  justifyContent = "flex-start",
  flexWrap,
  style,
}: StackProps) {
  const { styles } = useStyles(createXStackStyles);

  return <View style={[styles.container, { gap }, { alignItems, justifyContent, flexWrap }, style]}>{children}</View>;
}

const createYStackStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
    },
  });

const createXStackStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
    },
  });

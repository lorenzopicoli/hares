import React from "react";
import { StyleSheet, View } from "react-native";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";

export const Spacing = ({ size }: { size: "small" | "medium" | "large" }) => {
  const { styles } = useStyles(createStyles);
  return <View style={[styles.spacing, styles[size]]} />;
};

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    spacing: {
      backgroundColor: "transparent",
    },
    large: {
      height: 80,
    },
    medium: {
      height: 60,
    },
    small: {
      height: 40,
    },
  });

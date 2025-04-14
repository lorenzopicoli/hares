import React from "react";
import { StyleSheet, View } from "react-native";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";

export const Separator = () => {
  const { styles } = useStyles(createStyles);
  return <View style={styles.separator} />;
};

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    separator: {
      height: 1,
      backgroundColor: theme.border,
    },
  });

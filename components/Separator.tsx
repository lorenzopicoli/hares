import React from "react";
import { StyleSheet, View } from "react-native";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";

export const Separator = (props: { containerBackgroundColor?: string }) => {
  const { styles } = useStyles(createStyles);
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: props.containerBackgroundColor
          ? props.containerBackgroundColor
          : styles.container.backgroundColor,
      }}
    >
      <View style={styles.separator} />
    </View>
  );
};

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      backgroundColor: theme.secondaryBackground,
    },
    separator: {
      borderBottomColor: theme.border,
      borderTopColor: "transparent",
      borderRightColor: "transparent",
      borderLeftColor: "transparent",
      borderWidth: 1,
      marginHorizontal: Sizes.medium,
    },
  });

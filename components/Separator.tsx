import React from "react";
import { StyleSheet, View } from "react-native";
import type { ThemedColors } from "@/contexts/ThemeContext";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";

export const Separator = (props: { overrideHorizontalMargin?: number; containerBackgroundColor?: string }) => {
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
      <View
        style={{
          ...styles.separator,

          marginHorizontal:
            props.overrideHorizontalMargin !== undefined
              ? props.overrideHorizontalMargin
              : styles.separator.marginHorizontal,
        }}
      />
    </View>
  );
};

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      // Avoids a weird little glitch where there would be a gap between list items
      marginTop: -1,
      backgroundColor: theme.background,
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

import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import useStyles from "@/hooks/useStyles";
import type { ThemedColors } from "./ThemeProvider";

interface RadioButtonProps {
  checked: boolean;
  disabled?: boolean;
  onPress?: () => void;
  size?: number;
}

export default function RadioButton({ checked, disabled = false, onPress, size = 20 }: RadioButtonProps) {
  const { styles } = useStyles(createStyles);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.container, { width: size, height: size }, disabled && styles.containerDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {checked && (
        <View
          style={[styles.innerCircle, { width: size / 2, height: size / 2 }, disabled && styles.innerCircleDisabled]}
        />
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      borderRadius: 999,
      borderWidth: 2,
      borderColor: theme.darkTint,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    containerDisabled: {
      borderColor: theme.secondaryText,
      opacity: 0.5,
    },
    innerCircle: {
      borderRadius: 999,
      backgroundColor: theme.tint,
    },
    innerCircleDisabled: {
      backgroundColor: theme.secondaryText,
    },
  });

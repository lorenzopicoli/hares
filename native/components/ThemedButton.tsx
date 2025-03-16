import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";

interface ThemedButtonProps {
  title?: string;
  onPress?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
}

const ThemedButton: React.FC<ThemedButtonProps> = ({ title, onPress, fullWidth = false, disabled = false }) => {
  const { styles } = useStyles(createStyles);

  return (
    <Pressable
      style={[styles.button, fullWidth && styles.fullWidth, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
    </Pressable>
  );
};

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    button: {
      backgroundColor: theme.tint,
      height: Sizes.buttonHeight,
      paddingHorizontal: Sizes.small,
      borderRadius: Sizes.radius.small,
      alignItems: "center",
      justifyContent: "center",
    },
    fullWidth: {
      width: "100%",
    },
    disabled: {
      backgroundColor: theme.input.backgroundDisabled,
      borderColor: theme.input.border,
    },
    text: {
      color: theme.text,
      fontWeight: "600",
    },
    disabledText: {
      color: theme.secondaryText,
    },
  });

export default ThemedButton;

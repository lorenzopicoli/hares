import React from "react";
import { StyleSheet, Text, TouchableOpacity, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";

interface ThemedButtonProps {
  title?: string;
  onPress?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  mode?: "accent" | "ghost" | "danger";
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  fullWidth = false,
  disabled = false,
  style,
  textStyle,
  mode = "accent",
}) => {
  const { styles } = useStyles(createStyles);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        mode === "accent" && styles.accentButton,
        mode === "ghost" && styles.ghostButton,
        mode === "danger" && styles.dangerButton,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    accentButton: {
      backgroundColor: theme.tint,
    },
    ghostButton: {
      backgroundColor: theme.toggleButton.background,
      borderColor: theme.toggleButton.border,
      borderWidth: 1,
    },
    dangerButton: {
      backgroundColor: theme.danger,
    },
    button: {
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
      backgroundColor: theme.darkTint,
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

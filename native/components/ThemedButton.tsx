import React from "react";
import { StyleSheet, Text, TouchableOpacity, type StyleProp, type ViewStyle } from "react-native";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";

interface ThemedButtonProps {
  title?: string;
  onPress?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  mode?: "accent" | "ghost";
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  fullWidth = false,
  disabled = false,
  style,
  mode = "accent",
}) => {
  const { styles } = useStyles(createStyles);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        mode === "accent" && styles.accentButton,
        mode === "ghost" && styles.ghostButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
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

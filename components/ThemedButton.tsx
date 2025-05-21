import React from "react";
import { StyleSheet, TouchableOpacity, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import type { ThemedColors } from "@/contexts/ThemeContext";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";
import { ThemedText } from "./ThemedText";

interface ThemedButtonProps {
  title?: string;
  onPress?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  mode?: "accent" | "ghost" | "danger" | "toggle";
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
        mode === "toggle" && styles.toggleButton,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedText
        style={[
          styles.text,
          disabled && styles.disabledText,
          textStyle,
          mode === "accent" && styles.accentText,
          mode === "ghost" && styles.ghostText,
          mode === "danger" && styles.dangerText,
          mode === "toggle" && styles.toggleText,
        ]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    accentButton: {
      backgroundColor: theme.button.primary.background,
    },
    ghostButton: {
      backgroundColor: theme.button.ghost.background,
      borderColor: theme.button.ghost.border,
      borderWidth: 1,
    },
    dangerButton: {
      backgroundColor: theme.button.danger.background,
    },
    toggleButton: {
      backgroundColor: theme.toggleButton.background,
      borderColor: theme.toggleButton.border,
      borderWidth: 1,
    },
    toggleText: {
      color: theme.text,
    },
    accentText: {
      color: theme.button.primary.text,
    },
    ghostText: {
      color: theme.button.ghost.text,
    },
    dangerText: {
      color: theme.button.danger.text,
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
    },
    text: {
      //   color: theme.text,
      fontWeight: "600",
    },
    disabledText: {
      color: theme.secondaryText,
    },
  });

export default ThemedButton;

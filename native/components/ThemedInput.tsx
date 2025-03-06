import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";

interface ThemedInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad"
    | "decimal-pad"
    | "url"
    | "web-search";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
  maxLength?: number;
  disabled?: boolean;
}

const ThemedInput: React.FC<ThemedInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
  maxLength,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const { styles } = useStyles(createStyles);
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#71747A"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          selectionColor="#4C6EF5"
          maxLength={maxLength}
          editable={!disabled}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconContainer}
            disabled={disabled}
          >
            <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color={disabled ? "#4A4D52" : "#71747A"} />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
      width: "100%",
    },
    label: {
      color: theme.secondaryText,
      fontSize: 14,
      marginBottom: 8,
      fontWeight: "500",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      //   backgroundColor: theme.input.background,
      //   backgroundColor: "red",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.input.border,
      height: 48,
      paddingHorizontal: 12,
    },
    inputFocused: {
      borderColor: theme.input.focusedBorder,
      backgroundColor: "#25262B",
    },
    inputError: {
      borderColor: theme.input.borderError,
    },
    inputDisabled: {
      opacity: 0.6,
      backgroundColor: theme.input.backgroundDisabled,
    },
    input: {
      flex: 1,
      color: theme.input.text,
      fontSize: 16,
      height: "100%",
      //   backgroundColor: "red",
    },
    iconContainer: {
      padding: 4,
    },
    errorText: {
      color: theme.input.textError,
      fontSize: 12,
      marginTop: 4,
    },
  });

export default ThemedInput;

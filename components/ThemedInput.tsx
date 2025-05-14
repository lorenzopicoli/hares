import React from "react";
import { View, TextInput, StyleSheet, type TextInputProps, type StyleProp, type ViewStyle } from "react-native";
import type { ThemedColors } from "@/contexts/ThemeContext";
import useStyles from "@/hooks/useStyles";
import ThemedInputLabel from "./ThemedInputLabel";
import { Controller, type ControllerProps, type FieldValues, type Path } from "react-hook-form";
import InputErrorLabel from "./InputErrorLabel";

interface ThemedInputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
}

interface FormThemedInputProps<T extends FieldValues, K extends Path<T>> extends ThemedInputProps {
  form: Omit<ControllerProps<T, K, T>, "render">;
}

export function FormThemedInput<T extends FieldValues, K extends Path<T>>(props: FormThemedInputProps<T, K>) {
  const { form, ...inputProps } = props;

  return (
    <Controller
      {...form}
      render={({ field: { onChange, onBlur, value }, fieldState }) => {
        return (
          <ThemedInput
            {...inputProps}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value === undefined || value === null ? value : String(value)}
            error={fieldState.error?.message}
          />
        );
      }}
    />
  );
}

export default function ThemedInput(props: ThemedInputProps) {
  const { label, containerStyle, error, ...inputProps } = props;
  const { styles } = useStyles(createStyles);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus: ThemedInputProps["onFocus"] = (e) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur: ThemedInputProps["onBlur"] = (e) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <ThemedInputLabel label={label} />}

      <View
        style={[
          styles.inputContainer,
          props.editable === false && styles.inputDisabled,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        <TextInput
          {...inputProps}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          placeholderTextColor="#71747A"
          selectionColor="#4C6EF5"
        />
      </View>

      <InputErrorLabel error={error} />
    </View>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.input.border,
      height: 48,
      paddingHorizontal: 12,
      backgroundColor: theme.input.background,
    },
    inputFocused: {
      borderColor: theme.input.focusedBorder,
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
    },
  });

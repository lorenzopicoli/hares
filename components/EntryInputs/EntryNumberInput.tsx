import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { useRef, useState } from "react";
import { StyleSheet, View, TextInput, type TextInputProps, type StyleProp, type ViewStyle } from "react-native";
import ThemedButton from "../ThemedButton";
import type { ThemedColors } from "../ThemeProvider";
import { type FieldValues, type Path, type ControllerProps, Controller } from "react-hook-form";
import InputErrorLabel from "../InputErrorLabel";
import { Pressable } from "react-native-gesture-handler";
import { Fonts } from "@/constants/Colors";

export interface EntryNumberInputProps extends Omit<TextInputProps, "onChangeText" | "value"> {
  onChangeText?: (value: number | null) => void;
  value?: number | null;
  error?: string;
  prefix?: string | null;
  suffix?: string | null;
  showCounterButtons?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

interface FormEntryNumberInputProps<T extends FieldValues, K extends Path<T>> extends EntryNumberInputProps {
  form: Omit<ControllerProps<T, K, T>, "render">;
}

export function FormEntryNumberInput<T extends FieldValues, K extends Path<T>>(props: FormEntryNumberInputProps<T, K>) {
  const { form, ...inputProps } = props;

  return (
    <Controller
      {...form}
      render={({ field: { onChange, onBlur, value }, fieldState }) => {
        return (
          <EntryNumberInput
            {...inputProps}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={fieldState.error?.message}
          />
        );
      }}
    />
  );
}

export default function EntryNumberInput(props: EntryNumberInputProps) {
  const {
    error,
    prefix,
    suffix,
    value,
    containerStyle,
    showCounterButtons = true,
    onChangeText,
    ...inputProps
  } = props;

  const hiddenInputRef = useRef<TextInput>(null);
  const { styles } = useStyles(createStyles);
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (text: string) => {
    if (!text) {
      onChangeText?.(null);
      return;
    }

    // Remove any non-numeric characters except decimal point
    const numericText = text.replace(/[^0-9.-]/g, "");

    const parsedNumber = Number.parseFloat(numericText);

    if (!Number.isNaN(parsedNumber)) {
      onChangeText?.(parsedNumber);
    }
  };

  const formatDisplayValue = () => {
    if (value === null || value === undefined) return "—";

    let formattedValue = String(value);
    if (prefix) {
      formattedValue = `${prefix} ${formattedValue}`;
    }
    if (suffix) {
      formattedValue = `${formattedValue} ${suffix}`;
    }

    return formattedValue;
  };

  const handlePlus = () => {
    onChangeText?.((value ?? 0) + 1);
  };

  const handleMinus = () => {
    onChangeText?.((value ?? 0) - 1);
  };

  // Need to blur before focus: https://github.com/facebook/react-native/issues/33532
  const focusHiddenInput = () => {
    hiddenInputRef.current?.blur();

    setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 100);
  };

  const handleFocus: EntryNumberInputProps["onFocus"] = (e) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur: EntryNumberInputProps["onBlur"] = (e) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <View style={containerStyle}>
      {/* Visible input (display only) */}
      <Pressable style={[styles.numberInputContainer, isFocused && styles.inputFocused]} onPressIn={focusHiddenInput}>
        <TextInput style={styles.numberInput} value={formatDisplayValue()} editable={false} />
      </Pressable>

      {/* Hidden input (actual input) */}
      <TextInput
        {...inputProps}
        ref={hiddenInputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={styles.hiddenNumberInput}
        onChangeText={handleTextChange}
        keyboardType="numeric"
      />

      {showCounterButtons ? (
        <View style={styles.numberCounterButtonsContainer}>
          <ThemedButton
            textStyle={styles.counterButtonText}
            style={styles.counterButton}
            title="—"
            onPress={handleMinus}
          />
          <ThemedButton
            textStyle={styles.counterButtonText}
            style={styles.counterButton}
            title="+"
            onPress={handlePlus}
          />
        </View>
      ) : null}
      <InputErrorLabel error={error} />
    </View>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    counterButton: {
      width: 40,
    },
    counterButtonText: {
      fontSize: 20,
    },
    numberInputContainer: {
      flex: 1,
      height: "100%",
      width: "100%",
      borderRadius: Sizes.radius.small,
      borderWidth: 1,
      borderColor: theme.border,
    },
    inputFocused: {
      borderColor: theme.input.focusedBorder,
    },
    numberInput: {
      flex: 1,
      color: theme.input.text,
      ...Fonts.medium,
      fontSize: 70,
      fontWeight: 600,
      textAlign: "center",
    },
    hiddenNumberInput: {
      position: "absolute",
      width: 1,
      height: 1,
      opacity: 0,
    },
    numberCounterButtonsContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      gap: Sizes.medium,
      marginTop: Sizes.small,
    },
  });

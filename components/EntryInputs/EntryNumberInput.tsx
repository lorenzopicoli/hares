import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { useRef } from "react";
import { StyleSheet, View, TextInput, Pressable, type TextInputProps } from "react-native";
import ThemedButton from "../ThemedButton";
import type { ThemedColors } from "../ThemeProvider";
import { type FieldValues, type Path, type ControllerProps, Controller } from "react-hook-form";
import { ThemedText } from "../ThemedText";

export interface EntryNumberInputProps extends Omit<TextInputProps, "onChangeText" | "value"> {
  onChangeText?: (value: number | null) => void;
  value?: number | null;
  error?: string;
  prefix?: string | null;
  suffix?: string | null;
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
  const { error, prefix, suffix, value, onChangeText, ...inputProps } = props;
  const hiddenInputRef = useRef<TextInput>(null);
  const { styles } = useStyles(createStyles);

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
    if (value === null || value === undefined) return "_";

    let formattedValue = String(value);
    if (prefix) {
      formattedValue = `${prefix} ${formattedValue}`;
    }
    if (suffix) {
      formattedValue = `${formattedValue} ${suffix}`;
    }

    return formattedValue;
  };

  const focusHiddenInput = () => {
    hiddenInputRef.current?.focus();
  };

  //   useEffect(() => {
  //     props.onChangeText?.(numberValue);
  //   }, [numberValue, props.onChangeText]);

  return (
    <View>
      {/* Visible input (display only) */}
      <Pressable onPressIn={focusHiddenInput}>
        <TextInput style={styles.numberInput} value={formatDisplayValue()} editable={false} />
      </Pressable>

      {/* Hidden input (actual input) */}
      <TextInput
        {...inputProps}
        ref={hiddenInputRef}
        style={styles.hiddenNumberInput}
        onChangeText={handleTextChange}
        keyboardType="numeric"
      />

      <View style={styles.numberCounterButtonsContainer}>
        <ThemedButton
          textStyle={styles.counterButtonText}
          style={styles.counterButton}
          title="—"
          //   onPress={() => setNumberValue((numberValue ?? 0) - 1)}
        />
        <ThemedButton
          textStyle={styles.counterButtonText}
          style={styles.counterButton}
          title="+"
          //   onPress={() => setNumberValue((numberValue ?? 0) + 1)}
        />
      </View>
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
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
    numberInput: {
      flex: 1,
      color: theme.input.text,
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
    },
    errorText: {
      color: theme.input.textError,
      fontSize: 12,
      marginTop: Sizes.xSmall,
    },
  });

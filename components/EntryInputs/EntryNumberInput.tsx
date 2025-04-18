import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import ThemedButton from "../ThemedButton";
import type { ThemedColors } from "../ThemeProvider";

export interface EntryNumberInputProps {
  onChange?: (value: number | null) => void;
  prefix?: string | null;
  suffix?: string | null;
}

export default function EntryNumberInput(props: EntryNumberInputProps) {
  const [numberValue, setNumberValue] = useState<number | null>(0);
  const hiddenInputRef = useRef<TextInput>(null);
  const { styles } = useStyles(createStyles);

  const handleTextChange = (text: string) => {
    if (!text) {
      setNumberValue(null);
      return;
    }

    // Remove any non-numeric characters except decimal point
    const numericText = text.replace(/[^0-9.-]/g, "");

    const parsedNumber = Number.parseFloat(numericText);
    if (!Number.isNaN(parsedNumber)) {
      setNumberValue(parsedNumber);
    }
  };

  const formatDisplayValue = () => {
    if (numberValue === null) return "_";

    let formattedValue = String(numberValue);
    if (props.prefix) {
      formattedValue = `${props.prefix} ${formattedValue}`;
    }
    if (props.suffix) {
      formattedValue = `${formattedValue} ${props.suffix}`;
    }

    return formattedValue;
  };

  const focusHiddenInput = () => {
    hiddenInputRef.current?.focus();
  };

  useEffect(() => {
    props.onChange?.(numberValue);
  }, [numberValue, props.onChange]);

  return (
    <View>
      {/* Visible input (display only) */}
      <Pressable onPressIn={focusHiddenInput}>
        <TextInput style={styles.numberInput} value={formatDisplayValue()} editable={false} />
      </Pressable>

      {/* Hidden input (actual input) */}
      <TextInput
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
          onPress={() => setNumberValue((numberValue ?? 0) - 1)}
        />
        <ThemedButton
          textStyle={styles.counterButtonText}
          style={styles.counterButton}
          title="+"
          onPress={() => setNumberValue((numberValue ?? 0) + 1)}
        />
      </View>
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
  });

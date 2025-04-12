import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import ThemedButton from "../ThemedButton";
import type { ThemedColors } from "../ThemeProvider";

export interface EntryNumberInputProps {
  onChange?: (value: number | null) => void;
  prefix?: string;
  suffix?: string;
}

// TODO: use a hidden input to format result and avoid flickering
export default function EntryNumberInput(props: EntryNumberInputProps) {
  const [numberValue, setNumberValue] = useState<number | null>(0);
  const { styles } = useStyles(createStyles);
  const refNumberInput = useRef<TextInput>(null);

  const handleTextChange = (text: string) => {
    if (!text) {
      setNumberValue(null);
      return;
    }
    setNumberValue(Number.parseFloat(text.replace("_", "")));
  };

  useEffect(() => {
    props.onChange?.(numberValue);
  }, [numberValue, props.onChange]);

  return (
    <View>
      <TextInput
        ref={refNumberInput}
        style={styles.numberInput}
        value={numberValue !== null ? String(numberValue) : "_"}
        onChangeText={handleTextChange}
        keyboardType="numeric"
        // autoFocus
        caretHidden
      />
      <View style={styles.numberCounterButtonsContainer}>
        <ThemedButton style={{ width: 40 }} title="-" onPress={() => setNumberValue((numberValue ?? 0) - 1)} />
        <ThemedButton style={{ width: 40 }} title="+" onPress={() => setNumberValue((numberValue ?? 0) + 1)} />
      </View>
    </View>
  );
}
const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    numberInput: {
      flex: 1,
      color: theme.input.text,
      fontSize: 70,
      fontWeight: 600,
      textAlign: "center",
    },
    numberCounterButtonsContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      gap: Sizes.medium,
    },
  });

import { StyleSheet } from "react-native";
import type { ThemedColors } from "./ThemeProvider";
import { Picker, type PickerProps } from "@react-native-picker/picker";
import useStyles from "@/hooks/useStyles";

type ThemedPickerProps<T> = PickerProps<T> & {
  items: { label: string; value: string }[];
};

export default function ThemedPicker<T>({ items, ...pickerProps }: ThemedPickerProps<T>) {
  const { styles } = useStyles(createStyles);
  return (
    <Picker {...pickerProps} style={styles.picker} itemStyle={styles.item}>
      {items.map((i) => (
        <Picker.Item key={i.value} value={i.value} label={i.label} style={styles.item} />
      ))}
    </Picker>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    picker: {
      color: theme.text,
      backgroundColor: "blue",
    },
    item: {
      color: theme.text,
    },
  });

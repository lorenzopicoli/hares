import useStyles from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import type { ThemedColors } from "@/contexts/ThemeContext";
import { StyleSheet } from "react-native";
import { Sizes } from "@/constants/Sizes";

export default function InputErrorLabel({ error }: { error?: string }) {
  const { styles } = useStyles(createStyles);
  return error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null;
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    errorText: {
      color: theme.input.textError,
      fontSize: 12,
      marginTop: Sizes.xSmall,
    },
  });

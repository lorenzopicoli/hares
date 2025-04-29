import { StyleSheet } from "react-native";
import { XStack } from "./Stacks";
import type { ThemedColors } from "./ThemeProvider";
import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import type { ReactNode } from "react";

export default function TextListItem(props: { title: string; right?: ReactNode }) {
  const { styles } = useStyles(createStyles);
  return (
    <XStack style={styles.container} justifyContent="space-between">
      <ThemedText>{props.title}</ThemedText>

      {props.right ? props.right : null}
    </XStack>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      height: Sizes.list.medium,
      padding: Sizes.medium,
    },
  });

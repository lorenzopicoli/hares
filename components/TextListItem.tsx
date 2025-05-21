import { StyleSheet } from "react-native";
import { XStack } from "./Stacks";
import type { ThemedColors } from "@/contexts/ThemeContext";
import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import type { ReactNode } from "react";

export default function TextListItem(props: { title: string | ReactNode; right?: ReactNode; dynamicHeight?: boolean }) {
  const { styles } = useStyles(createStyles);
  return (
    <XStack style={[styles.container, !props.dynamicHeight && styles.height]} justifyContent="space-between">
      {typeof props.title === "string" ? <ThemedText>{props.title}</ThemedText> : props.title}

      {props.right ? props.right : null}
    </XStack>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      padding: Sizes.medium,
    },
    height: {
      height: Sizes.list.medium,
    },
  });

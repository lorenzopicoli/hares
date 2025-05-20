import { StyleSheet, View } from "react-native";
import { XStack } from "./Stacks";
import { useColors, type ThemedColors } from "@/contexts/ThemeContext";
import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import type { ReactNode } from "react";

export default function InfoListItem(props: { title: string | ReactNode }) {
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();
  return (
    <XStack flexWrap="nowrap" style={[styles.container]} justifyContent="space-between">
      <View style={styles.textContainer}>
        {typeof props.title === "string" ? <ThemedText style={styles.text}>{props.title}</ThemedText> : props.title}
      </View>
    </XStack>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      padding: Sizes.medium,
    },
    text: {
      color: theme.secondaryText,
    },
    textContainer: {
      flexShrink: 1,
    },
  });

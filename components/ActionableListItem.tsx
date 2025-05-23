import { StyleSheet, TouchableOpacity } from "react-native";
import { XStack, YStack } from "./Stacks";
import type { ThemedColors } from "@/contexts/ThemeContext";
import useStyles from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import { Entypo } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Sizes } from "@/constants/Sizes";

export default function ActionableListItem(props: {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  onPress?: () => void;
  right?: ReactNode;
  height?: number;
}) {
  const { styles } = useStyles(createStyles);
  return (
    <TouchableOpacity style={[styles.container, !!props.height && { height: props.height }]} onPress={props.onPress}>
      <XStack style={styles.xStack} alignItems="center" justifyContent="space-between">
        <YStack gap={0}>
          {typeof props.title === "string" ? <ThemedText>{props.title}</ThemedText> : props.title}
          {props.subtitle ? (
            typeof props.subtitle === "string" ? (
              <ThemedText type="subtitle">{props.subtitle}</ThemedText>
            ) : (
              props.subtitle
            )
          ) : null}
        </YStack>

        {props.right ? props.right : <Entypo name="chevron-small-right" size={24} color={styles.iconColor.color} />}
      </XStack>
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      padding: Sizes.medium,
    },
    xStack: {
      flex: 1,
    },
    iconColor: {
      color: theme.text,
    },
  });

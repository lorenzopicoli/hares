import { StyleSheet, TouchableOpacity } from "react-native";
import { XStack } from "./Stacks";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import { Entypo } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Sizes } from "@/constants/Sizes";

export default function ActionableListItem(props: {
  title: string | ReactNode;
  onPress?: () => void;
  right?: ReactNode;
}) {
  const { styles } = useStyles(createStyles);
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <XStack style={styles.xStack} alignItems="center" justifyContent="space-between">
        {typeof props.title === "string" ? <ThemedText>{props.title}</ThemedText> : props.title}

        {props.right ? props.right : <Entypo name="chevron-small-right" size={24} color={styles.iconColor.color} />}
      </XStack>
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      padding: Sizes.medium,
      height: "100%",
    },
    xStack: {
      flex: 1,
    },
    iconColor: {
      color: theme.text,
    },
  });

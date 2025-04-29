import { StyleSheet, TouchableOpacity } from "react-native";
import { XStack } from "./Stacks";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import { Entypo } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Sizes } from "@/constants/Sizes";

export default function BottomSheetListItem(props: {
  left?: ReactNode;
  title: string | ReactNode;
  onPress?: () => void;
  right?: ReactNode;
}) {
  const { styles } = useStyles(createStyles);
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <XStack style={styles.xStack} alignItems="center" justifyContent="space-between">
        <XStack justifyContent="center" gap={Sizes.small}>
          {props.left ? props.left : null}
          {typeof props.title === "string" ? <ThemedText>{props.title}</ThemedText> : props.title}
        </XStack>

        {props.right ? props.right : <Entypo name="chevron-small-right" size={24} color={styles.iconColor.color} />}
      </XStack>
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: Sizes.medium,
      height: 40,
      width: "100%",
    },
    xStack: {
      flex: 1,
    },
    iconColor: {
      color: theme.text,
    },
  });

import useStyles from "@/hooks/useStyles";
import { useColors, type ThemedColors } from "./ThemeProvider";
import { Sizes } from "@/constants/Sizes";
import type { PropsWithChildren, ReactNode } from "react";
import { XStack, YStack } from "./Stacks";
import { ThemedText } from "./ThemedText";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { Separator } from "./Separator";

interface CardProps extends PropsWithChildren {
  title: string;
  right?: ReactNode;
  onFilterPress?: () => void;
  onHeaderPress?: () => void;
}

export default function Card(props: CardProps) {
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();
  return (
    <YStack gap={0} alignItems="stretch" style={styles.card}>
      <YStack style={styles.topSection} gap={Sizes.medium} alignItems="center">
        <TouchableHighlight underlayColor="none" style={styles.headerPress} onPress={props?.onHeaderPress}>
          <XStack>
            <ThemedText style={styles.title} type="title">
              {props.title}
            </ThemedText>
            {props.right ? <View style={styles.right}>{props.right}</View> : null}
          </XStack>
        </TouchableHighlight>
        <Separator overrideHorizontalMargin={0} containerBackgroundColor={colors.secondaryBackground} />
      </YStack>
      {props.children}
    </YStack>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      paddingVertical: Sizes.large,
      backgroundColor: theme.secondaryBackground,
      borderRadius: Sizes.radius.medium,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,

      elevation: 4,
    },
    topSection: {
      paddingHorizontal: Sizes.large,
    },
    title: {
      flex: 1,
    },
    headerPress: {
      flex: 1,
      width: "100%",
    },
    right: {
      alignSelf: "flex-end",
    },
  });

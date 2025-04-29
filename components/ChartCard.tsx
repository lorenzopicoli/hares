import useStyles from "@/hooks/useStyles";
import { useColors, type ThemedColors } from "./ThemeProvider";
import { Sizes } from "@/constants/Sizes";
import type { PropsWithChildren } from "react";
import { YStack } from "./Stacks";
import { ThemedText } from "./ThemedText";
import { StyleSheet } from "react-native";
import { Separator } from "./Separator";

interface ChartCardProps extends PropsWithChildren {
  title: string;
}

export default function ChartCard(props: ChartCardProps) {
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();
  return (
    <YStack gap={0} alignItems="stretch" style={styles.card}>
      <YStack style={styles.topSection} gap={Sizes.medium} alignItems="center">
        <ThemedText type="title">{props.title}</ThemedText>
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

      elevation: 5,
    },
    topSection: {
      paddingHorizontal: Sizes.large,
    },
  });

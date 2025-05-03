import useStyles from "@/hooks/useStyles";
import { useColors, type ThemedColors } from "./ThemeProvider";
import type { PropsWithChildren, ReactNode } from "react";
import { YStack } from "./Stacks";
import { ThemedText } from "./ThemedText";
import { StyleSheet } from "react-native";
import { Sizes } from "@/constants/Sizes";
import { Logo } from "./Logo";
import { Spacing } from "./Spacing";

interface EmptyStateProps extends PropsWithChildren {
  title: string;
  subTitle?: ReactNode;
  onCallToAction?: () => void;
}

export default function EmptyState(props: EmptyStateProps) {
  const { styles } = useStyles(createStyles);
  const { colors, theme } = useColors();
  return (
    <YStack gap={0} style={styles.container} alignItems="center">
      <Logo
        logoProps={{ width: 200, height: 200 }}
        bgProps={{ fill: colors.logoBg, width: 410, height: 410, opacity: 0.5 }}
      />
      <Spacing size="small" />
      <ThemedText style={styles.title}>{props.title}</ThemedText>
      <Spacing size="xSmall" />
      <ThemedText style={styles.subtitle}>{props.subTitle}</ThemedText>
    </YStack>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: Sizes.xLarge,
      paddingTop: 100,
      overflow: "visible",
    },
    title: {
      lineHeight: 27,
      fontSize: 27,
      fontWeight: 500,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 18,
      textAlign: "center",
      color: theme.secondaryText,
    },
  });

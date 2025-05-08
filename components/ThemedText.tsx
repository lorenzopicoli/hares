import { Text, type TextProps, StyleSheet } from "react-native";
import { useColors, type ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Fonts } from "@/constants/Colors";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({ style, lightColor, darkColor, type = "default", ...rest }: ThemedTextProps) {
  const { colors } = useColors();
  const { styles } = useStyles(createStyles);

  return (
    <Text
      style={[
        { color: colors.text },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    default: {
      ...Fonts.regular,
      fontSize: 16,
      lineHeight: 24,
    },
    defaultSemiBold: {
      ...Fonts.medium,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "600",
    },
    title: {
      ...Fonts.bold,
      fontSize: 24,
      fontWeight: "bold",
      lineHeight: 24,
    },
    subtitle: {
      ...Fonts.bold,
      fontSize: 14,
      color: theme.secondaryText,
      fontWeight: "bold",
    },
    link: {
      ...Fonts.regular,
      lineHeight: 30,
      fontSize: 16,
      color: "#0a7ea4",
    },
  });

import { useColors, type ThemedColors } from "@/contexts/ThemeContext";
import { useMemo } from "react";
import type { StyleSheet } from "react-native";

interface Styles<T extends StyleSheet.NamedStyles<T>> {
  colors: ThemedColors;
  styles: T;
}

export default function <T extends StyleSheet.NamedStyles<T>>(createStyle: (colors: ThemedColors) => T): Styles<T> {
  const { colors } = useColors();

  return {
    colors: colors,
    styles: useMemo(() => createStyle(colors), [colors, createStyle]),
  };
}

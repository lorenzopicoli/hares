import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { type ThemedColors, useColors } from "@/contexts/ThemeContext";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function LoadingDatabase() {
  const { colors } = useColors();
  return (
    <ThemedView>
      <ThemedText>Loading database, please wait</ThemedText>
      <ActivityIndicator size="large" color={colors.text} />
    </ThemedView>
  );
}

const createSearchStyles = (theme: ThemedColors) => StyleSheet.create({});

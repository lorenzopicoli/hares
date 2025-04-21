import { SafeAreaView, View, type ViewProps } from "react-native";
import { useColors } from "./ThemeProvider";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { colors } = useColors();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[{ backgroundColor: colors.background, flex: 1 }, style]} {...otherProps} />
    </SafeAreaView>
  );
}

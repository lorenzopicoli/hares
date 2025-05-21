import { KeyboardAvoidingView, Platform, SafeAreaView, View, type ViewProps } from "react-native";
import { useColors } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { colors } = useColors();

  return <View style={[{ backgroundColor: colors.background, flex: 1 }, style]} {...otherProps} />;
}

export function ThemedSafeAreaView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { colors } = useColors();
  const insets = useSafeAreaInsets();

  // Haven't had any keyboard problems on android, but I did once
  // I tried to use KeyboardAvoidingView. Since android is my daily
  // driver, I would rather not mess with it
  if (Platform.OS === "ios") {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={insets.bottom + 60} behavior={"padding"}>
        <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }, style]} {...otherProps} />
      </KeyboardAvoidingView>
    );
  }
  return <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }, style]} {...otherProps} />;
}

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { ThemeProvider as MyThemeProvider } from "@/components/ThemeProvider";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Platform } from "react-native";
import { Colors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(Colors[colorScheme ?? "dark"].background);
    }
    SystemUI.setBackgroundColorAsync(Colors[colorScheme ?? 'dark'].background);
  }, [colorScheme]);

  if (!loaded) {
    return null;
  }

  return (
    <MyThemeProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="addtracker" options={{ headerShown: true, headerTitle: "🐰 Add tracker" }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: true, headerTitle: "🐰 Hares" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </MyThemeProvider>
  );
}

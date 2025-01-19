import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { evolu } from "../db/db";
import * as NavigationBar from "expo-navigation-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { EvoluProvider } from "@evolu/react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(backgroundColor);
  }, [backgroundColor]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <EvoluProvider value={evolu}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: true, headerTitle: "🐰 Hares" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </EvoluProvider>
    </ThemeProvider>
  );
}

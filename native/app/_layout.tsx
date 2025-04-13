import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { ThemeProvider as MyThemeProvider } from "@/components/ThemeProvider";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Text, Platform } from "react-native";
import { Colors } from "@/constants/Colors";
import { db } from "@/db";
import migrations from "@/drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { success, error } = useMigrations(db, migrations);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (success) {
      console.log("Successfully ran migrations");
    }

    if (error) {
      console.log("Failed to run migrations", error);
    }
  }, [success, error]);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(Colors[colorScheme ?? "dark"].background);
    }
    SystemUI.setBackgroundColorAsync(Colors[colorScheme ?? "dark"].background);
  }, [colorScheme]);

  if (error) {
    return <Text>Failed to load DB {JSON.stringify({ error })}</Text>;
  }

  //   if (!loaded) {
  //     return null;
  //   }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MyThemeProvider>
        <ActionSheetProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="collection/addCollection"
                options={{ headerShown: true, headerTitle: "🐰 Add Collection" }}
              />
              <Stack.Screen name="entry/addEntry" options={{ headerShown: true, headerTitle: "🐰 Add Entry" }} />
              <Stack.Screen name="entry/textListSelection" options={{ headerShown: true, headerTitle: "🐰" }} />
              <Stack.Screen name="tracker/addTracker" options={{ headerShown: true, headerTitle: "🐰 Add Tracker" }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </ActionSheetProvider>
      </MyThemeProvider>
    </GestureHandlerRootView>
  );
}

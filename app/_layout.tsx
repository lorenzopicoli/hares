import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { Suspense, useCallback, useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { ThemeProvider as MyThemeProvider } from "@/components/ThemeProvider";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Platform, SafeAreaView } from "react-native";
import { Colors, NavBarColors } from "@/constants/Colors";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import LoadingDatabase from "@/components/LoadingDatabase";
import { enableScreens } from "react-native-screens";
import { StatusBar } from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootStack() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="collection/addCollection" options={{ headerShown: true, headerTitle: "🐰 Add Collection" }} />
      <Stack.Screen name="entry/addEntry" options={{ headerShown: true, headerTitle: "🐰 Add Entry" }} />
      <Stack.Screen name="entry/textListSelection" options={{ headerShown: true, headerTitle: "🐰 Entry items" }} />
      <Stack.Screen name="tracker/addTracker" options={{ headerShown: true, headerTitle: "🐰 Add Tracker" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  enableScreens(true);

  const handleDbLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(Colors[colorScheme ?? "dark"].background);
    }
    SystemUI.setBackgroundColorAsync(Colors[colorScheme ?? "dark"].background);
  }, [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MyThemeProvider>
        <ActionSheetProvider>
          <ThemeProvider value={NavBarColors[colorScheme ?? "dark"]}>
            <Suspense fallback={<LoadingDatabase />}>
              <DatabaseProvider onLoad={handleDbLoaded}>
                <SafeAreaView
                  style={{ flex: 0, backgroundColor: NavBarColors[colorScheme ?? "dark"].colors.background }}
                />
                <RootStack />
                <StatusBar style="auto" />
              </DatabaseProvider>
            </Suspense>
          </ThemeProvider>
        </ActionSheetProvider>
      </MyThemeProvider>
    </GestureHandlerRootView>
  );
}

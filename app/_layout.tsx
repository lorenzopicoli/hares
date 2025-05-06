import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { Suspense, useCallback, useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { ThemeProvider as MyThemeProvider, useColors } from "@/components/ThemeProvider";
import "react-native-reanimated";

import { Platform, SafeAreaView } from "react-native";
import { Colors, defaultStackNavigationStyling, NavBarColors } from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import LoadingDatabase from "@/components/LoadingDatabase";
import { enableScreens } from "react-native-screens";
import { StatusBar } from "expo-status-bar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SettingsProvider } from "@/components/SettingsProvieder";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootStack() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ ...defaultStackNavigationStyling, headerTitle: "Home", headerShown: false }}
      />
      <Stack.Screen
        name="collection/addCollection"
        options={{ ...defaultStackNavigationStyling, headerShown: true, headerTitle: "🐰 Add Collection" }}
      />
      <Stack.Screen
        name="entry/addEntry"
        options={{ ...defaultStackNavigationStyling, headerShown: true, headerTitle: "🐰 Add Entry" }}
      />
      <Stack.Screen
        name="entry/textListSelection"
        options={{ ...defaultStackNavigationStyling, headerShown: true, headerTitle: "🐰 Entry items" }}
      />
      <Stack.Screen
        name="tracker/addTracker"
        options={{ ...defaultStackNavigationStyling, headerShown: true, headerTitle: "🐰 Add Tracker" }}
      />
      <Stack.Screen
        name="stats/selectStatTracker"
        options={{ ...defaultStackNavigationStyling, headerShown: true, headerTitle: "🐰 Select tracker" }}
      />
      <Stack.Screen
        name="settings/exportLogs"
        options={{ ...defaultStackNavigationStyling, headerShown: true, headerTitle: "🐰 Export Logs" }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  enableScreens(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MyThemeProvider>
        <ThemedLayout />
      </MyThemeProvider>
    </GestureHandlerRootView>
  );
}

function ThemedLayout() {
  const { theme } = useColors();

  const handleDbLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(Colors[theme].background);
    }
    SystemUI.setBackgroundColorAsync(Colors[theme].background);
  }, [theme]);

  return (
    <ThemeProvider value={NavBarColors[theme]}>
      <Suspense fallback={<LoadingDatabase />}>
        <DatabaseProvider onLoad={handleDbLoaded}>
          <SettingsProvider>
            <BottomSheetModalProvider>
              <SafeAreaView style={{ flex: 0, backgroundColor: NavBarColors[theme].colors.background }} />
              <RootStack />
              <StatusBar style={theme === "light" ? "dark" : "light"} />
            </BottomSheetModalProvider>
          </SettingsProvider>
        </DatabaseProvider>
      </Suspense>
    </ThemeProvider>
  );
}

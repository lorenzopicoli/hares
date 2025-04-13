import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { enableScreens } from "react-native-screens";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  // Not really sure, but the hook doesn't work here
  const themedColors = Colors[colorScheme ?? "dark"];
  enableScreens(true);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themedColors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarInactiveBackgroundColor: themedColors.background,
        tabBarActiveBackgroundColor: themedColors.background,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: themedColors.background,
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: "Track",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="entries"
        options={{
          title: "Entries",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navbarButtons: {
    display: "flex",
    flexDirection: "row",
  },
});

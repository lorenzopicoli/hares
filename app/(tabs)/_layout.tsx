import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColors } from "@/components/ThemeProvider";
import { HapticPressable } from "@/components/HapticPressable";

export default function TabLayout() {
  const { colors } = useColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticPressable,
        tabBarInactiveBackgroundColor: colors.background,
        tabBarActiveBackgroundColor: colors.background,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: colors.background,
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

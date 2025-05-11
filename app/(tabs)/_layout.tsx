import { Tabs } from "expo-router";

import { useColors } from "@/contexts/ThemeContext";
import { HapticPressable } from "@/components/HapticPressable";
import { MaterialIcons } from "@expo/vector-icons";
import { Fonts } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";

export default function TabLayout() {
  const { colors } = useColors();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticPressable,
        tabBarInactiveBackgroundColor: colors.background,
        tabBarActiveBackgroundColor: colors.background,
        tabBarLabelStyle: {
          color: colors.text,
          ...Fonts.regular,
        },
        tabBarLabel: ({ focused }) => {
          const textStyleProperty = focused ? Fonts.bold : Fonts.regular;
          return (
            <ThemedText
              style={{
                ...textStyleProperty,
                // marginRight: -1,
                fontSize: 10,
                lineHeight: 13,
                textTransform: "capitalize",
              }}
            >
              {route.name}
            </ThemedText>
          );
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderColor: colors.border,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Track",
          href: null,
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: "Track",
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="add-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="entries"
        options={{
          title: "Entries",
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="format-list-bulleted" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}

import { Tabs, useNavigation } from "expo-router";
import { Platform, View, StyleSheet } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import ThemedLink from "@/components/ThemedLink";
import { useColors } from "@/components/ThemeProvider";
import { enableScreens } from "react-native-screens";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { colors } = useColors();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.navbarButtons}>
          <ThemedLink path={"/addtracker"}>
            <Ionicons name="add" size={30} color="#fff" />
          </ThemedLink>
        </View>
      ),
    });
  }, [navigation]);

  enableScreens(true)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
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

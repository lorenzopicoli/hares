import { router, Tabs, useNavigation } from "expo-router";
import { Platform, View, StyleSheet, Pressable } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/components/ThemeProvider";
import { enableScreens } from "react-native-screens";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { colors } = useColors();
  const { showActionSheetWithOptions } = useActionSheet();
  enableScreens(true);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.navbarButtons}>
          <Pressable onPress={handleManage}>
            <Ionicons name="add" size={30} color="#fff" />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  const handleManage = () => {
    const options = ["Add tracker", "Add collection", "Edit current collection", "Cancel"];
    const cancelButtonIndex = options.length - 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        containerStyle: { backgroundColor: colors.background },
        textStyle: { color: colors.text },
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            router.push("/addTracker");
            break;

          case 1:
            router.push("/addCollection");
            break;

          case 2:
            router.push("/editCollection");
            break;

          default:
        }
      },
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
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

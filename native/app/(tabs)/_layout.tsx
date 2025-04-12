import { Tabs, useNavigation, useRouter } from "expo-router";
import { Platform, View, StyleSheet, TouchableOpacity } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { enableScreens } from "react-native-screens";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();
  // Not really sure, but the hook doesn't work here
  const themedColors = Colors[colorScheme ?? "dark"];
  enableScreens(true);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.navbarButtons}>
          {/* On press in because of: https://github.com/expo/expo/issues/29489 */}
          <TouchableOpacity onPressIn={handleManage}>
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
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
        containerStyle: { backgroundColor: themedColors.background },
        textStyle: { color: themedColors.text },
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
            router.push("/addCollection");
            break;

          default:
        }
      },
    );
  };

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

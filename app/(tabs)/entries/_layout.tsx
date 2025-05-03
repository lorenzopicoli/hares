import { defaultStackNavigationStyling } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function EntriesRoot() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ ...defaultStackNavigationStyling, headerShown: true, headerTitle: "🐰 Entries" }}
      />
    </Stack>
  );
}

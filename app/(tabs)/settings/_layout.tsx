import { Stack } from "expo-router";

export default function SettingsRoot() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, headerTitle: "🐰 Settings" }} />
    </Stack>
  );
}

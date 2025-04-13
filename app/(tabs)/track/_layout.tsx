import { Stack } from "expo-router";

export default function HomeRoot() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, headerTitle: "🐰 Trackers" }} />
    </Stack>
  );
}

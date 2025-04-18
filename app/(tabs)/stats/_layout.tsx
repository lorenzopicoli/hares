import { Stack } from "expo-router";

export default function StatsRoot() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, headerTitle: "🐰 Stats" }} />
    </Stack>
  );
}

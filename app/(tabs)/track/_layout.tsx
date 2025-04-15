import { Stack } from "expo-router";

export default function TrackRoot() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, headerTitle: "🐰 Trackers" }} />
    </Stack>
  );
}

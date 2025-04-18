import { Stack } from "expo-router";

export default function EntriesRoot() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, headerTitle: "🐰 Entries" }} />
    </Stack>
  );
}

import { subMonths } from "date-fns";
import { Stack } from "expo-router";

export default function StatsRoot() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: true, headerTitle: "🐰 Stats" }}
        initialParams={{
          startDate: new Date().toISOString(),
          endDate: subMonths(new Date(), 1).toISOString(),
        }}
      />
    </Stack>
  );
}

import { defaultStackNavigationStyling } from "@/constants/Colors";
import { subMonths } from "date-fns";
import { Stack } from "expo-router";

export default function StatsRoot() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ ...defaultStackNavigationStyling, headerShown: true, headerTitle: "🐰 Stats" }}
        initialParams={{
          startDate: subMonths(new Date(), 3).toISOString(),
          endDate: new Date().toISOString(),
        }}
      />
    </Stack>
  );
}

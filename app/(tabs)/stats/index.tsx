import ThemedScrollView from "@/components/ThemedScrollView";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTracker } from "@/hooks/data/useTracker";
import { ThemedView } from "@/components/ThemedView";
import { TrackerType } from "@/db/schema";
import TextListBarChart from "@/components/charts/TextListBarChart";
import { useEntries } from "@/hooks/data/useEntries";
import EntriesListRow from "@/components/EntriesList/EntriesListRow";
import useStyles from "@/hooks/useStyles";
import { EntryCountLineChart, NumberTrackersLineChart } from "@/components/charts/LineCharts";
import { XStack, YStack } from "@/components/Stacks";
import { Platform, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { useColors, type ThemedColors } from "@/components/ThemeProvider";
import { Sizes } from "@/constants/Sizes";
import { CalendarHeatmapChart } from "@/components/charts/CalendarHeatmapChart";
import ChartCard from "@/components/ChartCard";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import SearchInput from "@/components/SearchInput";
import { Separator } from "@/components/Separator";
import { subMonths } from "date-fns";
import {
  StatsScreenOptionsBottomSheet,
  type StatsDateRange,
} from "@/components/BottomSheets/StatsScreenOptionsBottomSheet";
import EmptyState from "@/components/EmptyState";

export default function StatsScreen() {
  const {
    trackerId: trackerIdParam,
    startDate: startDateParam,
    endDate: endDateParam,
  } = useLocalSearchParams<{
    trackerId?: string;
    startDate?: string;
    endDate?: string;
  }>();
  const screenOptionsBottomSheetRef = useRef<BottomSheetModal>(null);

  const router = useRouter();
  const { colors } = useColors();
  const { styles } = useStyles(createStyles);
  const trackerId = useMemo(() => (trackerIdParam ? +trackerIdParam : undefined), [trackerIdParam]);
  const { tracker } = useTracker(trackerId ?? -1);
  const { entries } = useEntries({ trackerId, limit: 5 });

  const [dateRange, setDateRange] = useState({
    startDate: startDateParam ? new Date(startDateParam) : subMonths(new Date(), 1),
    endDate: endDateParam ? new Date(endDateParam) : new Date(),
  });

  useEffect(() => {
    if (dateRange) {
      router.setParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      });
    }
  }, [dateRange, router]);

  const handleDateRangeChange = useCallback((range: StatsDateRange) => {
    setDateRange(range);
  }, []);

  const showOptionsSheet = () => {
    screenOptionsBottomSheetRef.current?.present();
  };

  const handleSelectTracker = () => {
    router.navigate({ pathname: "/stats/selectStatTracker" });
  };

  const handleSeeAllEntries = () => {
    router.navigate({ pathname: "/(tabs)/entries", params: { searchText: tracker?.name } });
  };

  return (
    <ThemedScrollView>
      <YStack alignItems="stretch">
        <XStack>
          <ThemedView>
            <Pressable onPressIn={Platform.OS === "android" ? handleSelectTracker : undefined}>
              <SearchInput
                onPress={Platform.OS === "ios" ? handleSelectTracker : undefined}
                editable={false}
                hideClose
                value={tracker?.name ?? ""}
                placeholder="Select tracker..."
              />
            </Pressable>
          </ThemedView>
          <TouchableOpacity style={styles.filterButton} onPress={showOptionsSheet}>
            <MaterialIcons name="date-range" size={20} color={colors.text} />
          </TouchableOpacity>
        </XStack>
      </YStack>
      {tracker ? (
        <>
          {tracker.type === TrackerType.Number ||
          tracker.type === TrackerType.Scale ||
          tracker.type === TrackerType.Boolean ? (
            <CalendarHeatmapChart dateRange={dateRange} tracker={tracker} />
          ) : null}

          {tracker.type === TrackerType.TextList ? <TextListBarChart dateRange={dateRange} tracker={tracker} /> : null}

          {tracker.type === TrackerType.Number || tracker.type === TrackerType.Scale ? (
            <NumberTrackersLineChart tracker={tracker} dateRange={dateRange} />
          ) : null}

          <EntryCountLineChart tracker={tracker} dateRange={dateRange} />

          <ThemedView>
            <ChartCard
              title={"Latest entries"}
              right={<Entypo name="chevron-small-right" size={24} color={colors.text} />}
              onHeaderPress={handleSeeAllEntries}
            >
              {entries.map((entry, i) => (
                <View key={entry.id} style={{ paddingHorizontal: Sizes.medium }}>
                  <EntriesListRow entry={entry} hideTrackerName style={styles.listItem} />
                  {i !== entries.length - 1 ? (
                    <Separator overrideHorizontalMargin={0} containerBackgroundColor={colors.secondaryBackground} />
                  ) : null}
                </View>
              ))}
            </ChartCard>
          </ThemedView>
        </>
      ) : (
        <ThemedView>
          <EmptyState
            title="No tracker selected"
            subTitle="Use the search bar above to choose a tracker and view its stats."
          />
        </ThemedView>
      )}
      <StatsScreenOptionsBottomSheet
        ref={screenOptionsBottomSheetRef}
        onDateRangeChange={handleDateRangeChange}
        initialDate={dateRange}
      />
    </ThemedScrollView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    listItem: {
      paddingVertical: Sizes.medium,
    },
    filterButton: {
      backgroundColor: theme.toggleButton.background,
      height: 40,
      width: 40,
      borderRadius: Sizes.radius.small,
      alignItems: "center",
      justifyContent: "center",
    },
  });

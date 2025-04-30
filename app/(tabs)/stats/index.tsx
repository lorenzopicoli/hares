import ThemedScrollView from "@/components/ThemedScrollView";
import { useLocalSearchParams, useRouter } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTracker } from "@/hooks/data/useTracker";
import { ThemedView } from "@/components/ThemedView";
import { TrackerType } from "@/db/schema";
import TextListBarChart from "@/components/charts/TextListBarChart";
import { useEntries } from "@/hooks/data/useEntries";
import EntriesListRow from "@/components/EntriesList/EntriesListRow";
import useStyles from "@/hooks/useStyles";
import { EntryCountLineChart, NumberTrackersLineChart } from "@/components/charts/LineCharts";
import { Spacing } from "@/components/Spacing";
import { XStack, YStack } from "@/components/Stacks";
import { DateGroupingPeriod } from "@/utils/dateGroupPeriod";
import { GroupFunction } from "@/utils/groupFunctions";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { useColors, type ThemedColors } from "@/components/ThemeProvider";
import { Sizes } from "@/constants/Sizes";
import { CalendarHeatmapChart } from "@/components/charts/CalendarHeatmapChart";
import ChartCard from "@/components/ChartCard";
import { ChartOptionsBottomSheet, type StatsDateRange } from "@/components/BottomSheets/ChartOptionsBottomSheet";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import SearchInput from "@/components/SearchInput";
import { Separator } from "@/components/Separator";
import { subMonths } from "date-fns";

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
  const optionsBottomSheetRef = useRef<BottomSheetModal>(null);

  const router = useRouter();
  const { colors } = useColors();
  const { styles } = useStyles(createStyles);
  const trackerId = useMemo(() => (trackerIdParam ? +trackerIdParam : undefined), [trackerIdParam]);
  const { tracker } = useTracker(trackerId ?? -1);
  const { entries } = useEntries({ trackerId, limit: 5 });

  const [limit, setLimit] = useState(10);
  const [groupPeriod, setGroupPeriod] = useState<DateGroupingPeriod>(DateGroupingPeriod.daily);
  const [groupFun, setGroupFun] = useState<GroupFunction>(GroupFunction.avg);
  const [includeOther, setIncludeOther] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: startDateParam ? new Date(startDateParam) : new Date(),
    endDate: endDateParam ? new Date(endDateParam) : subMonths(new Date(), 1),
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
    optionsBottomSheetRef.current?.present();
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
            <Pressable onPressIn={handleSelectTracker}>
              <SearchInput editable={false} hideClose value={tracker?.name ?? ""} />
            </Pressable>
          </ThemedView>
          <TouchableOpacity style={styles.filterButton} onPress={showOptionsSheet}>
            <MaterialIcons name="date-range" size={20} color={colors.text} />
          </TouchableOpacity>
        </XStack>
      </YStack>
      <Spacing size="xSmall" />
      {tracker ? (
        <>
          {tracker.type === TrackerType.Number || tracker.type === TrackerType.Scale ? (
            <>
              <ChartCard title="Daily values">
                <CalendarHeatmapChart
                  dateRange={dateRange}
                  tracker={tracker}
                  groupPeriod={groupPeriod}
                  groupFun={groupFun}
                />
              </ChartCard>
            </>
          ) : null}
          <ChartCard title="# of entries">
            <EntryCountLineChart tracker={tracker} groupPeriod={groupPeriod} dateRange={dateRange} />
          </ChartCard>

          {tracker.type === TrackerType.TextList ? (
            <>
              <ChartCard title={`Top ${limit} entries in ${tracker.name}`}>
                <TextListBarChart limit={limit} tracker={tracker} includeOthers={includeOther} />
              </ChartCard>
            </>
          ) : null}

          {tracker.type === TrackerType.Number || tracker.type === TrackerType.Scale ? (
            <>
              <ChartCard title="Entry values">
                <NumberTrackersLineChart
                  tracker={tracker}
                  groupPeriod={groupPeriod}
                  groupFun={groupFun}
                  dateRange={dateRange}
                />
              </ChartCard>
            </>
          ) : null}

          <ThemedView>
            {/* <SectionList
              style={styles.list}
              sections={[
                {
                  title: <ThemedText type="title">Previous Entries</ThemedText>,
                  data: entries.map((entry) => ({
                    key: entry.id,
                    render: <EntriesListRow entry={entry} hideTrackerName style={styles.listItem} />,
                  })),
                },
              ]}
            /> */}
            <ChartCard title={"Entries"}>
              {entries.map((entry) => (
                <View key={entry.id} style={{ paddingHorizontal: Sizes.medium }}>
                  <EntriesListRow entry={entry} hideTrackerName style={styles.listItem} />
                  <Separator overrideHorizontalMargin={0} containerBackgroundColor={colors.secondaryBackground} />
                </View>
              ))}
            </ChartCard>
          </ThemedView>
          {tracker ? <ThemedButton title="See all entries" onPress={handleSeeAllEntries} /> : null}
        </>
      ) : null}
      <ChartOptionsBottomSheet ref={optionsBottomSheetRef} onDateRangeChange={handleDateRangeChange} />
    </ThemedScrollView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    listContainer: {
      paddingVertical: Sizes.small,
    },
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
    list: {
      //   paddingHorizontal: Sizes.medium,
    },
  });

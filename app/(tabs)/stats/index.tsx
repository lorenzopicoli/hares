import ThemedScrollView from "@/components/ThemedScrollView";
import { useLocalSearchParams, useRouter } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import { useMemo, useRef, useState } from "react";
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
import { ChartOptionsBottomSheet } from "@/components/BottomSheets/ChartOptionsBottomSheet";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import SearchInput from "@/components/SearchInput";
import { Separator } from "@/components/Separator";

export default function StatsScreen() {
  const { trackerId: trackerIdParam } = useLocalSearchParams<{
    trackerId?: string;
  }>();

  const router = useRouter();
  const { colors } = useColors();
  const { styles } = useStyles(createStyles);
  const trackerId = useMemo(() => (trackerIdParam ? +trackerIdParam : undefined), [trackerIdParam]);
  const { tracker } = useTracker(trackerId ?? -1);
  const [limit, setLimit] = useState(10);
  const [groupPeriod, setGroupPeriod] = useState<DateGroupingPeriod>(DateGroupingPeriod.daily);
  const [groupFun, setGroupFun] = useState<GroupFunction>(GroupFunction.avg);
  const [includeOther, setIncludeOther] = useState(false);
  const { entries } = useEntries({ trackerId, limit: 5 });
  const optionsBottomSheetRef = useRef<BottomSheetModal>(null);

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
            <MaterialIcons name="settings-input-component" size={20} color={colors.text} />
          </TouchableOpacity>
        </XStack>
        {/* <XStack>
          <ThemedInput
            containerStyle={{ flex: 1 }}
            keyboardType="numeric"
            label="Limit"
            onChangeText={(t) => setLimit(+t || 0)}
          />

          <ThemedView>
            <ThemedToggleButtons
              label="Remaining text"
              onChangeSelection={(o) => setIncludeOther(!!o)}
              options={[{ label: "Include", value: true }]}
              columns={1}
              allowUnselect
              buttonContainerStyle={{ height: 48 }}
            />
          </ThemedView>
        </XStack>
        <ThemedToggleButtons
          label="Group by"
          selectedOption={groupPeriod}
          onChangeSelection={(i) => setGroupPeriod(i ?? DateGroupingPeriod.daily)}
          options={[
            { label: "Daily", value: DateGroupingPeriod.daily },
            { label: "Weekly", value: DateGroupingPeriod.weekly },
            { label: "Monthly", value: DateGroupingPeriod.monthly },
            { label: "Yearly", value: DateGroupingPeriod.yearly },
          ]}
          columns={4}
        />
        <ThemedToggleButtons
          label="Group function"
          selectedOption={groupFun}
          onChangeSelection={(i) => setGroupFun(i ?? GroupFunction.avg)}
          options={[
            { label: "Average", value: GroupFunction.avg },
            { label: "Sum", value: GroupFunction.sum },
            { label: "Max", value: GroupFunction.max },
            { label: "Min", value: GroupFunction.min },
          ]}
          columns={4}
        /> */}
      </YStack>
      <Spacing size="xSmall" />
      {tracker ? (
        <>
          {tracker.type === TrackerType.Number || tracker.type === TrackerType.Scale ? (
            <>
              <ChartCard title="Daily values">
                <CalendarHeatmapChart tracker={tracker} groupPeriod={groupPeriod} groupFun={groupFun} />
              </ChartCard>
            </>
          ) : null}
          <ChartCard title="# of entries">
            <EntryCountLineChart tracker={tracker} groupPeriod={groupPeriod} />
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
                <NumberTrackersLineChart tracker={tracker} groupPeriod={groupPeriod} groupFun={groupFun} />
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
      <ChartOptionsBottomSheet ref={optionsBottomSheetRef} />
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

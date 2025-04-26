import ThemedScrollView from "@/components/ThemedScrollView";
import type { ChartRef } from "@/components/charts/Chart";
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
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/components/Spacing";
import ThemedInput from "@/components/ThemedInput";
import { XStack, YStack } from "@/components/Stacks";
import ThemedToggleButtons from "@/components/ThemedToggleButtons";
import type { ThemedColors } from "@/components/ThemeProvider";
import { StyleSheet } from "react-native";
import { Sizes } from "@/constants/Sizes";
import { DateGroupingPeriod } from "@/utils/dateGroupPeriod";
import { GroupFunction } from "@/utils/groupFunctions";

export default function StatsScreen() {
  const { trackerId: trackerIdParam } = useLocalSearchParams<{
    trackerId?: string;
  }>();

  const router = useRouter();
  const { styles } = useStyles(createStyles);
  const trackerId = useMemo(() => (trackerIdParam ? +trackerIdParam : undefined), [trackerIdParam]);
  const { tracker } = useTracker(trackerId ?? -1);
  const [limit, setLimit] = useState(10);
  const [groupPeriod, setGroupPeriod] = useState<DateGroupingPeriod>(DateGroupingPeriod.daily);
  const [groupFun, setGroupFun] = useState<GroupFunction>(GroupFunction.avg);
  const [includeOther, setIncludeOther] = useState(false);
  const chartRef = useRef<ChartRef>(null);
  const { entries } = useEntries({ trackerId, limit: 5 });

  const handleSelectTracker = () => {
    router.navigate({ pathname: "/stats/selectStatTracker" });
  };

  const handleSeeAllEntries = () => {
    router.navigate({ pathname: "/(tabs)/entries", params: { searchText: tracker?.name } });
  };

  return (
    <ThemedScrollView>
      <ThemedText type="subtitle">Filters</ThemedText>
      <YStack>
        <ThemedButton
          title={tracker ? `Selected tracker ${tracker.name}` : "Select a tracker"}
          mode="toggle"
          onPress={handleSelectTracker}
        />
        <XStack>
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
          onChangeSelection={(i) => setGroupFun((i as "avg" | "sum") ?? "avg")}
          options={[
            { label: "Average", value: GroupFunction.avg },
            { label: "Sum", value: GroupFunction.sum },
            { label: "Max", value: GroupFunction.max },
            { label: "Min", value: GroupFunction.min },
          ]}
          columns={4}
        />
      </YStack>
      <Spacing size="xSmall" />
      {tracker ? (
        <>
          <ThemedView style={{ height: 500 }}>
            <EntryCountLineChart tracker={tracker} groupPeriod={groupPeriod} />
          </ThemedView>

          {tracker.type === TrackerType.TextList ? (
            <>
              <ThemedView style={{ height: 500 }}>
                <TextListBarChart limit={limit} tracker={tracker} includeOthers={includeOther} />
              </ThemedView>
            </>
          ) : null}

          {tracker.type === TrackerType.Number || tracker.type === TrackerType.Scale ? (
            <>
              <ThemedView style={{ height: 500 }}>
                <NumberTrackersLineChart tracker={tracker} groupPeriod={groupPeriod} groupFun={groupFun} />
              </ThemedView>
            </>
          ) : null}

          <ThemedView>
            {entries.map((entry) => (
              <EntriesListRow key={entry.id} entry={entry} hideTrackerName style={styles.listItem} />
            ))}
          </ThemedView>
          {tracker ? <ThemedButton title="See all entries" onPress={handleSeeAllEntries} /> : null}
        </>
      ) : null}
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
  });

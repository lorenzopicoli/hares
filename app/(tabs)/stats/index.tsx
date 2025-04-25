import ThemedScrollView from "@/components/ThemedScrollView";
import type { ChartRef } from "@/components/charts/Chart";
import { useLocalSearchParams, useRouter } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import { useMemo, useRef, useState } from "react";
import { useTracker } from "@/hooks/data/useTracker";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { TrackerType } from "@/db/schema";
import TextListBarChart from "@/components/charts/TextListBarChart";
import { useEntries } from "@/hooks/data/useEntries";
import EntriesListRow from "@/components/EntriesList/EntriesListRow";
import type { ThemedColors } from "@/components/ThemeProvider";
import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import EntryCountLineChart from "@/components/charts/EntryCountLineChart";
import type { DateGroupingPeriod } from "@/hooks/data/stats/useEntryCountStats";
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/components/Spacing";
import ThemedInput from "@/components/ThemedInput";
import { XStack, YStack } from "@/components/Stacks";
import Picker from "@/components/Picker";

export default function StatsScreen() {
  const { trackerId: trackerIdParam } = useLocalSearchParams<{
    trackerId?: string;
  }>();

  const router = useRouter();
  const { styles } = useStyles(createStyles);
  const trackerId = useMemo(() => (trackerIdParam ? +trackerIdParam : undefined), [trackerIdParam]);
  const { tracker } = useTracker(trackerId ?? -1);
  const [limit, setLimit] = useState(10);
  const [groupPeriod, setGroupPeriod] = useState<DateGroupingPeriod>("daily");
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
          <ThemedInput containerStyle={{ flex: 1 }} keyboardType="numeric" label="Limit" />
          <ThemedInput containerStyle={{ flex: 1 }} keyboardType="numeric" label="Limit" />
        </XStack>
        <Picker
          label="Pick a grouping"
          placeholder={"Select a grouping"}
          onValueChange={(value) => console.log(value)}
          items={[
            { label: "Football", value: "football" },
            { label: "Baseball", value: "baseball" },
            { label: "Hockey", value: "hockey" },
          ]}
        />
      </YStack>
      <Spacing size="xSmall" />
      {tracker ? (
        <>
          {tracker.type === TrackerType.TextList ? (
            <>
              <ThemedView style={{ height: 500 }}>
                <TextListBarChart limit={limit} tracker={tracker} includeOthers={includeOther} />
              </ThemedView>
            </>
          ) : null}

          <ThemedView style={{ height: 500 }}>
            <EntryCountLineChart tracker={tracker} groupPeriod={groupPeriod} />
          </ThemedView>

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

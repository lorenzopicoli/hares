import ThemedScrollView from "@/components/ThemedScrollView";
import { StyleSheet, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { TrackerType, type EntryDateInformation, type NewTrackerEntry } from "@/db/schema";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import ThemedToggleButtons from "@/components/ThemedToggleButtons";
import { Spacing } from "@/components/Spacing";
import EntryDateSelection from "@/components/EntryDateSelection";
import EntriesListRow from "@/components/EntriesList/EntriesListRow";
import EntryNumberInput from "@/components/EntryInputs/EntryNumberInput";
import EntrySliderInput from "@/components/EntryInputs/EntrySliderInput";
import { ChipGroup, type ChipData } from "@/components/Chip";
import { formatEntryDateInformation } from "@/utils/entryDate";
import { useEntries } from "@/hooks/data/useEntries";
import { useTracker } from "@/hooks/data/useTracker";
import { useCreateEntry } from "@/hooks/data/useCreateEntry";

export default function AddEntryScreen() {
  const router = useRouter();
  const { styles } = useStyles(createStyles);
  const { trackerId, textListSelections: textListSelectionsParam } = useLocalSearchParams<{
    trackerId: string;
    textListSelections?: string;
  }>();

  const { tracker } = useTracker(+trackerId);
  const { entries: lastEntries } = useEntries({ trackerId: +trackerId, limit: 10 });
  const { createEntry } = useCreateEntry();

  const initialDate = useMemo(() => new Date(), []);
  const [dateSelected, setSelectedDate] = useState<EntryDateInformation>({ date: initialDate });

  const [numberValue, setNumberValue] = useState<number | null>(null);
  const [yesOrNoValue, setYesOrNoValue] = useState<boolean | null>(null);
  const [textListValues, setTextListValues] = useState<string[]>(
    textListSelectionsParam ? JSON.parse(textListSelectionsParam) : [],
  );

  const currentDateFormatted = useMemo(() => formatEntryDateInformation(dateSelected), [dateSelected]);
  const chips = useMemo(() => textListValues.map((t) => ({ label: t, id: t })) ?? [], [textListValues]);
  const yesOrNoOptions = ["Yes", "No"];

  const handleDateSelectionChange = useCallback((data: EntryDateInformation) => setSelectedDate(data), []);
  const handleNumberInputChange = useCallback((value: number | null) => setNumberValue(value), []);
  const handleChipPress = (data: ChipData) => {
    setTextListValues([...textListValues.filter((t) => t !== data.id)]);
  };
  const handleYesOrNoChange = useCallback((option: string) => setYesOrNoValue(option === "Yes"), []);
  const handleGoToSelectItems = useCallback(() => {
    router.navigate({
      pathname: "./textListSelection",
      params: {
        trackerId: trackerId,
        preSelectedItems: JSON.stringify(textListValues),
      },
    });
  }, [router, trackerId, textListValues]);

  const handleSubmit = async () => {
    try {
      const entry: NewTrackerEntry = {
        date: "date" in dateSelected ? dateSelected.date : undefined,
        periodOfDay: "periodOfDay" in dateSelected ? dateSelected.periodOfDay : undefined,
        trackerId: +trackerId,
        numberValue: numberValue,
        booleanValue: yesOrNoValue !== null ? (yesOrNoValue ? 1 : 0) : null,
      };

      await createEntry(entry, textListValues);
      router.dismiss();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setTextListValues(textListSelectionsParam ? JSON.parse(textListSelectionsParam) : []);
  }, [textListSelectionsParam]);

  const renderEntryInput = () => {
    if (!tracker) return null;

    const { type: trackerType, prefix, suffix } = tracker;

    switch (trackerType) {
      case TrackerType.Number:
        return <EntryNumberInput suffix={suffix} prefix={prefix} onChange={handleNumberInputChange} />;

      case TrackerType.Scale:
        return (
          <EntrySliderInput
            onChange={handleNumberInputChange}
            min={tracker.rangeMin ?? 0}
            max={tracker.rangeMax ?? 100}
          />
        );

      case TrackerType.Boolean:
        return (
          <ThemedToggleButtons label="" columns={2} options={yesOrNoOptions} onChangeSelection={handleYesOrNoChange} />
        );

      case TrackerType.TextList:
        return (
          <View>
            <ThemedButton title="Select items" mode="ghost" onPress={handleGoToSelectItems} />
            <ChipGroup onChipPress={handleChipPress} showDelete chips={chips} />
          </View>
        );

      default:
        return <ThemedText>Unsupported tracker type: {trackerType}</ThemedText>;
    }
  };

  return (
    <ThemedView>
      <ThemedScrollView>
        <ThemedText>{currentDateFormatted}</ThemedText>
        <ThemedView>{renderEntryInput()}</ThemedView>

        <Spacing size="small" />
        <ThemedText type="title">Date options</ThemedText>
        <EntryDateSelection initialDate={initialDate} onSelectionChange={handleDateSelectionChange} />
        <Spacing size="small" />
        <ThemedText type="title">Previous entries</ThemedText>
        {lastEntries.map((entry) => (
          <EntriesListRow key={entry.id} entry={entry} />
        ))}
      </ThemedScrollView>
      <View style={styles.submitButtonContainer}>
        <ThemedButton fullWidth title="Log entry" onPress={handleSubmit} />
      </View>
    </ThemedView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    submitButtonContainer: {
      paddingHorizontal: Sizes.medium,
      marginBottom: Sizes.medium,
    },
  });

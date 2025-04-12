import ThemedScrollView from "@/components/ThemedScrollView";
import { StyleSheet, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import {
  entriesTable,
  textListEntriesTable,
  trackersTable,
  TrackerType,
  type EntryDateInformation,
  type NewTextListEntry,
  type NewTrackerEntry,
} from "@/db/schema";
import { db } from "@/db";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq, desc } from "drizzle-orm";
import { ThemedText } from "@/components/ThemedText";
import { useCallback, useMemo, useState } from "react";
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

export default function AddEntryScreen() {
  const router = useRouter();
  const { trackerId, textListSelections } = useLocalSearchParams<{
    trackerId: string;
    textListSelections?: string;
  }>();
  const { styles } = useStyles(createStyles);
  const { data: tracker } = useLiveQuery(db.select().from(trackersTable).where(eq(trackersTable.id, +trackerId)));
  const { data: lastEntries } = useLiveQuery(
    db.query.entriesTable.findMany({
      where: eq(entriesTable.trackerId, +trackerId),
      orderBy: desc(entriesTable.date),
      limit: 10,
      with: {
        textListValues: true,
      },
    }),
  );
  const initialDate = useMemo(() => new Date(), []);
  const [dateSelected, setSelectedDate] = useState<EntryDateInformation>({ date: initialDate });

  const [numberValue, setNumberValue] = useState<number | null>(null);
  const [yesOrNoValue, setYesOrNoValue] = useState<boolean | null>(null);
  const [textListValue, setTextListValue] = useState<string[]>(
    textListSelections ? JSON.parse(textListSelections) : [],
  );

  const handleDateSelectionChange = useCallback((data: EntryDateInformation) => setSelectedDate(data), []);
  const handleNumberInputChange = useCallback((value: number | null) => setNumberValue(value), []);
  const handleSubmit = async () => {
    try {
      const entry: NewTrackerEntry = {
        date: "date" in dateSelected ? dateSelected.date : undefined,
        periodOfDay: "periodOfDay" in dateSelected ? dateSelected.periodOfDay : undefined,
        trackerId: +trackerId,
        numberValue: numberValue,
        booleanValue: yesOrNoValue !== null ? (yesOrNoValue ? 1 : 0) : null,
      };
      const savedEntry = await db.insert(entriesTable).values(entry).returning({ id: entriesTable.id });
      if (textListValue.length > 0) {
        const textListEntries: NewTextListEntry[] = textListValue.map((value) => ({
          trackerId: +trackerId,
          entryId: savedEntry[0].id,
          name: value,
        }));
        await db.insert(textListEntriesTable).values(textListEntries);
      }
      router.back();
    } catch (e) {
      console.log(e);
    }
  };

  const handleChipPress = (data: ChipData) => {
    setTextListValue([...textListValue.filter((t) => t !== data.id)]);
  };

  const renderEntryInput = () => {
    if (!tracker || !tracker[0]) return null;

    const { type: trackerType, prefix, suffix } = tracker[0];

    switch (trackerType) {
      case TrackerType.Number:
        return <EntryNumberInput suffix={suffix} prefix={prefix} onChange={handleNumberInputChange} />;

      case TrackerType.Scale:
        return <EntrySliderInput onChange={handleNumberInputChange} min={0} max={100} />;

      case TrackerType.Boolean:
        return (
          <ThemedToggleButtons
            label=""
            columns={2}
            options={["Yes", "No"]}
            onChangeSelection={(option) => setYesOrNoValue(option === "Yes")}
          />
        );

      case TrackerType.TextList:
        return (
          <View>
            <ThemedButton
              title="Select items"
              mode="ghost"
              onPress={() => {
                router.navigate({ pathname: "/textListSelection", params: { trackerId: trackerId } });
              }}
            />
            <ChipGroup
              onChipPress={handleChipPress}
              showDelete
              chips={textListValue.map((t) => ({ label: t, id: t })) ?? []}
            />
          </View>
        );

      default:
        return <ThemedText>Unsupported tracker type: {trackerType}</ThemedText>;
    }
  };

  const currentDateFormatted = useMemo(() => formatEntryDateInformation(dateSelected), [dateSelected]);

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
    numberInput: {
      flex: 1,
      color: theme.input.text,
      fontSize: 70,
      fontWeight: 600,
      textAlign: "center",
    },
    numberCounterButtonsContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      gap: Sizes.medium,
    },
  });

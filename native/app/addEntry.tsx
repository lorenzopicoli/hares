import ThemedScrollView from "@/components/ThemedScrollView";
import { StyleSheet, type TextInput, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { entriesTable, trackersTable, TrackerType, type EntryDateInformation, type NewTrackerEntry } from "@/db/schema";
import { db } from "@/db";
import { router, useLocalSearchParams } from "expo-router";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq, desc } from "drizzle-orm";
import { ThemedText } from "@/components/ThemedText";
import { useCallback, useMemo, useRef, useState } from "react";
import type { ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import ThemedToggleButtons from "@/components/ThemedToggleButtons";
import { Spacing } from "@/components/Spacing";
import { formatEntryDate } from "@/utils/entryDate";
import EntryDateSelection from "@/components/EntryDateSelection";
import EntriesListRow from "@/components/EntriesList/EntriesListRow";
import EntryNumberInput from "@/components/EntryInputs/EntryNumberInput";
import EntrySliderInput from "@/components/EntryInputs/EntrySliderInput";

export default function AddEntryScreen() {
  const { trackerId } = useLocalSearchParams<{ trackerId: string }>();
  const { styles } = useStyles(createStyles);
  const { data: tracker } = useLiveQuery(db.select().from(trackersTable).where(eq(trackersTable.id, +trackerId)));
  const { data: lastEntries } = useLiveQuery(
    db
      .select()
      .from(entriesTable)
      .where(eq(entriesTable.trackerId, +trackerId))
      .orderBy(desc(entriesTable.date))
      .limit(10),
  );
  const refNumberInput = useRef<TextInput>(null);
  const initialDate = useMemo(() => new Date(), []);
  const [dateSelected, setSelectedDate] = useState<EntryDateInformation>({ date: initialDate });

  const [numberValue, setNumberValue] = useState<number | null>(0);
  const [scaleValue, setScaleValue] = useState<number | string | null>(null);
  const [yesOrNoValue, setYesOrNoValue] = useState<boolean | null>(null);

  const handleDateSelectionChange = useCallback((data: EntryDateInformation) => setSelectedDate(data), []);
  const handleNumberInputChange = useCallback((value: number | null) => setNumberValue(value), []);
  const handleSubmit = async () => {
    const entry: NewTrackerEntry = {
      date: "date" in dateSelected ? dateSelected.date : undefined,
      periodOfDay: "periodOfDay" in dateSelected ? dateSelected.periodOfDay : undefined,
      trackerId: +trackerId,
    };
    await db
      .insert(entriesTable)
      .values(entry)
      .catch((t) => console.log(t));
    router.back();
  };

  const renderEntryInput = () => {
    if (!tracker || !tracker[0]) return null;

    const trackerType = tracker[0].type;

    switch (trackerType) {
      case TrackerType.Number:
        return <EntryNumberInput onChange={handleNumberInputChange} />;

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
            {/* <ThemedInput label="Enter text" value={typeof value === "string" ? value : ""} onChangeText={setValue} /> */}
          </View>
        );

      default:
        return <ThemedText>Unsupported tracker type: {trackerType}</ThemedText>;
    }
  };

  const currentDateFormatted = useMemo(() => formatEntryDate(dateSelected), [dateSelected]);

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

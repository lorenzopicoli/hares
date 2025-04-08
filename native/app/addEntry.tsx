import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedInput from "@/components/ThemedInput";
import { StyleSheet, TextInput, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { PeriodOfDay, trackersTable, TrackerType } from "@/db/schema";
import { db } from "@/db";
import { router, useLocalSearchParams } from "expo-router";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { ThemedText } from "@/components/ThemedText";
import { useMemo, useRef, useState } from "react";
import type { ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import ThemedToggleButtons from "@/components/ThemedToggleButtons";
import DateTimePicker, { useDefaultStyles, type DateType } from "react-native-ui-datepicker";
import type { SingleChange } from "react-native-ui-datepicker/lib/typescript/types";
import ThemedModal from "@/components/ThemedModal";
import { format } from "date-fns";
import { Spacing } from "@/components/Spacing";

export default function AddEntryScreen() {
  const { trackerId } = useLocalSearchParams<{ trackerId: string }>();
  const { styles } = useStyles(createStyles);
  const { data: tracker } = useLiveQuery(db.select().from(trackersTable).where(eq(trackersTable.id, +trackerId)));
  const refNumberInput = useRef<TextInput>(null);
  const [dateSelected, setSelectedDate] = useState<DateType | null>(new Date());
  const [periodOfDay, setSelectedPeriodOfDay] = useState<PeriodOfDay | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerDefaultStyles = useDefaultStyles();

  const [numberValue, setNumberValue] = useState<number | null>(0);
  const [scaleValue, setScaleValue] = useState<number | string | null>(null);
  const [yesOrNoValue, setYesOrNoValue] = useState<boolean | null>(null);

  const handleSubmit = async () => {
    router.back();
  };

  const renderEntryInput = () => {
    if (!tracker || !tracker[0]) return null;

    const trackerType = tracker[0].type;

    switch (trackerType) {
      case TrackerType.Number:
        return (
          <>
            <TextInput
              ref={refNumberInput}
              style={styles.numberInput}
              value={numberValue !== null ? String(numberValue) : "_"}
              onChangeText={(text) => {
                if (!text) {
                  setNumberValue(null);
                  return;
                }
                setNumberValue(Number.parseFloat(text.replace("_", "")));
              }}
              keyboardType="numeric"
              autoFocus
              caretHidden
            />
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", gap: Sizes.large }}>
              <ThemedButton style={{ width: 40 }} title="-" onPress={() => setNumberValue((numberValue ?? 0) - 1)} />
              <ThemedButton style={{ width: 40 }} title="+" onPress={() => setNumberValue((numberValue ?? 0) + 1)} />
            </View>
          </>
        );

      case TrackerType.Scale:
        return (
          <View>
            <ThemedInput
              label="Or enter value manually"
              value={scaleValue?.toString() ?? ""}
              onChangeText={(text) => setScaleValue(text || null)}
              keyboardType="numeric"
            />
          </View>
        );

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

  const handlePressNow = () => {
    setSelectedDate(new Date());
    setSelectedPeriodOfDay(null);
  };
  const handlePressPeriodOfDay = (p: PeriodOfDay) => {
    setSelectedPeriodOfDay(p);
    setSelectedDate(null);
  };
  const handleDatePickerChange: SingleChange = ({ date }) => {
    setSelectedDate(date);
    setSelectedPeriodOfDay(null);
  };

  const toggleDatePicker = () => {
    if (!showDatePicker) {
      setSelectedDate(new Date());
    }
    setShowDatePicker(!showDatePicker);
  };

  const currentDateFormatted = useMemo(() => {
    if (dateSelected) {
      return format(new Date(dateSelected.valueOf()), "MMMM do, yyyy H:mma");
    }

    return periodOfDay;
  }, [periodOfDay, dateSelected]);

  return (
    <ThemedView>
      <ThemedScrollView>
        <ThemedText>{currentDateFormatted}</ThemedText>
        {renderEntryInput()}

        <Spacing size="small" />
        <ThemedText type="title">Date options</ThemedText>
        <View style={styles.dateSelectionButtonsContainer}>
          <ThemedButton title="Now" mode="ghost" style={styles.dateSelectionButton} onPress={handlePressNow} />
          <ThemedButton
            title="Morning"
            mode="ghost"
            style={styles.dateSelectionButton}
            onPress={() => handlePressPeriodOfDay(PeriodOfDay.Morning)}
          />
          <ThemedButton
            title="Afternoon"
            mode="ghost"
            style={styles.dateSelectionButton}
            onPress={() => handlePressPeriodOfDay(PeriodOfDay.Afternoon)}
          />
          <ThemedButton
            title="Evening"
            mode="ghost"
            style={styles.dateSelectionButton}
            onPress={() => handlePressPeriodOfDay(PeriodOfDay.Evening)}
          />
        </View>
        <ThemedButton title="Custom" mode="ghost" onPress={toggleDatePicker} style={styles.dateSelectionButton} />
        <Spacing size="small" />
        <ThemedText type="title">Previous entries</ThemedText>
      </ThemedScrollView>
      <View style={styles.submitButtonContainer}>
        <ThemedButton fullWidth title="Log entry" onPress={handleSubmit} />
      </View>
      <ThemedModal
        visible={showDatePicker}
        hideDismiss
        fullWidthButton
        onDismiss={toggleDatePicker}
        onConfirm={toggleDatePicker}
      >
        <View style={styles.datePickerContainer}>
          <ThemedText>{dateSelected?.toLocaleString()}</ThemedText>
          <DateTimePicker
            mode="single"
            initialView="time"
            navigationPosition="right"
            timePicker
            date={dateSelected ?? new Date()}
            onChange={handleDatePickerChange}
            styles={{
              ...datePickerDefaultStyles,
              ...styles.datePicker,
            }}
          />
        </View>
      </ThemedModal>
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
      fontSize: 60,
      height: "100%",
      textAlign: "center",
    },
    datePicker: {
      backgroundColor: "blue",
    },
    dateSelectionButtonsContainer: {
      flexDirection: "row",
      gap: Sizes.small,
    },
    dateSelectionButton: {
      flex: 1,
    },
    datePickerContainer: {
      flex: 1,
      width: "100%",
    },
  });

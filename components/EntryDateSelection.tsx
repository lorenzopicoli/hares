import { Sizes } from "@/constants/Sizes";
import { PeriodOfDay, type EntryDateInformation } from "@/db/schema";
import useStyles from "@/hooks/useStyles";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import DateTimePicker, { type DateType, useDefaultStyles } from "react-native-ui-datepicker";
import type { SingleChange } from "react-native-ui-datepicker/lib/typescript/types";
import ThemedButton from "./ThemedButton";
import ThemedModal from "./ThemedModal";
import { ThemedText } from "./ThemedText";
import type { ThemedColors } from "./ThemeProvider";

export interface EntryDateSelectionProps {
  initialDate: Date;
  onSelectionChange: (data: EntryDateInformation) => void;
}

export default function EntryDateSelection(props: EntryDateSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<DateType | null>(props.initialDate);
  const [periodOfDay, setSelectedPeriodOfDay] = useState<PeriodOfDay | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerDefaultStyles = useDefaultStyles();
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

  useEffect(() => {
    if (periodOfDay) {
      props.onSelectionChange({ periodOfDay });
    }
    if (selectedDate) {
      props.onSelectionChange({ date: new Date(selectedDate.valueOf()) });
    }
  }, [selectedDate, periodOfDay, props.onSelectionChange]);

  const { styles } = useStyles(createStyles);
  return (
    <View>
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
      <ThemedModal
        visible={showDatePicker}
        hideDismiss
        fullWidthButton
        onDismiss={toggleDatePicker}
        onConfirm={toggleDatePicker}
      >
        <View style={styles.datePickerContainer}>
          <ThemedText>{selectedDate?.toLocaleString()}</ThemedText>
          <DateTimePicker
            mode="single"
            initialView="time"
            navigationPosition="right"
            timePicker
            date={selectedDate ?? new Date()}
            onChange={handleDatePickerChange}
            styles={{
              ...datePickerDefaultStyles,
              ...styles.datePicker,
            }}
          />
        </View>
      </ThemedModal>
    </View>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    datePicker: {
      backgroundColor: "blue",
    },
    dateSelectionButtonsContainer: {
      flexDirection: "row",
      gap: Sizes.small,
      marginBottom: Sizes.small,
    },
    dateSelectionButton: {
      flex: 1,
    },
    datePickerContainer: {
      flex: 1,
      width: "100%",
    },
  });

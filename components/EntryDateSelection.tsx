import { Sizes } from "@/constants/Sizes";
import { PeriodOfDay, type EntryDateInformation } from "@/db/schema";
import useStyles from "@/hooks/useStyles";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import DateTimePicker, { type DateType, useDefaultStyles } from "react-native-ui-datepicker";
import type { SingleChange } from "react-native-ui-datepicker/lib/typescript/types";
import ThemedButton from "./ThemedButton";
import ThemedModal from "./ThemedModal";
import type { ThemedColors } from "./ThemeProvider";
import ThemedToggleButtons from "./ThemedToggleButtons";

export interface EntryDateSelectionProps {
  initialDate: Date;
  onSelectionChange: (data: EntryDateInformation) => void;
}

export default function EntryDateSelection(props: EntryDateSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<DateType | null>(props.initialDate);
  const [periodOfDay, setSelectedPeriodOfDay] = useState<PeriodOfDay | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [toggleButtonsSelectedOption, setToggleButtonsSelectedOption] = useState<string | null>("Now");
  const presetOptions = [
    { value: "now", label: "Now" },
    { value: PeriodOfDay.Morning, label: "Morning" },
    { value: PeriodOfDay.Afternoon, label: "Afternoon" },
    { value: PeriodOfDay.Evening, label: "Evening" },
  ];

  const datePickerDefaultStyles = useDefaultStyles();
  const handleDatePickerChange: SingleChange = ({ date }) => {
    setSelectedDate(date);
    setSelectedPeriodOfDay(null);
  };

  const toggleDatePicker = () => {
    setToggleButtonsSelectedOption(null);
    if (!showDatePicker) {
      setSelectedDate(new Date());
    }
    setShowDatePicker(!showDatePicker);
  };

  const handlePressToggleButton = (option: string) => {
    setToggleButtonsSelectedOption(option);
    switch (option) {
      case "now":
        setSelectedDate(new Date());
        setSelectedPeriodOfDay(null);
        break;
      case PeriodOfDay.Morning:
        setSelectedPeriodOfDay(PeriodOfDay.Morning);
        setSelectedDate(null);
        break;
      case PeriodOfDay.Afternoon:
        setSelectedPeriodOfDay(PeriodOfDay.Afternoon);
        setSelectedDate(null);
        break;
      case PeriodOfDay.Evening:
        setSelectedPeriodOfDay(PeriodOfDay.Evening);
        setSelectedDate(null);
        break;

      default:
        setSelectedDate(new Date());
        setSelectedPeriodOfDay(null);
        break;
    }
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
      <ThemedToggleButtons
        buttonContainerStyle={{ height: Sizes.buttonHeight }}
        label=""
        selectedOption={toggleButtonsSelectedOption}
        columns={4}
        options={presetOptions}
        onChangeSelection={handlePressToggleButton}
      />
      <ThemedButton title="Custom" mode="ghost" onPress={toggleDatePicker} style={styles.dateSelectionButton} />
      <ThemedModal
        visible={showDatePicker}
        hideDismiss
        fullWidthButton
        onDismiss={toggleDatePicker}
        onConfirm={toggleDatePicker}
      >
        <View style={styles.datePickerContainer}>
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
    dateSelectionButton: {
      marginTop: Sizes.small,
      flex: 1,
    },
    datePickerContainer: {
      flex: 1,
      width: "100%",
    },
  });

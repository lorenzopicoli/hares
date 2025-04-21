import { Sizes } from "@/constants/Sizes";
import { PeriodOfDay, type EntryDateInformation } from "@/db/schema";
import useStyles from "@/hooks/useStyles";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import type { SingleChange } from "react-native-ui-datepicker/lib/typescript/types";
import ThemedButton from "./ThemedButton";
import ThemedModal from "./ThemedModal";
import type { ThemedColors } from "./ThemeProvider";
import ThemedToggleButtons from "./ThemedToggleButtons";
import { type FieldValues, type Path, type ControllerProps, Controller } from "react-hook-form";
import { ThemedText } from "./ThemedText";
import { formatEntryDateInformation } from "@/utils/entryDate";

export interface EntryDateSelectionProps {
  onSelectionChange: (data: EntryDateInformation) => void;
  value: EntryDateInformation;
  error?: string;
}

interface FormDateSelectProps<T extends FieldValues, K extends Path<T>>
  extends Omit<EntryDateSelectionProps, "value" | "onSelectionChange"> {
  form: Omit<ControllerProps<T, K, T>, "render">;
}

export function FormEntryDateSelection<T extends FieldValues, K extends Path<T>>(props: FormDateSelectProps<T, K>) {
  const { form, ...inputProps } = props;

  return (
    <Controller
      {...form}
      render={({ field: { onChange, value }, fieldState }) => {
        return (
          <EntryDateSelection
            {...inputProps}
            onSelectionChange={onChange}
            value={value}
            error={fieldState.error?.message}
          />
        );
      }}
    />
  );
}

export default function EntryDateSelection(props: EntryDateSelectionProps) {
  const { value, onSelectionChange } = props;

  const datePickerDefaultStyles = useDefaultStyles();
  const { styles } = useStyles(createStyles);

  const currentDateFormatted = useMemo(() => (value ? formatEntryDateInformation(value) : "-"), [value]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const presetOptions = [
    { value: "now", label: "Now" },
    { value: PeriodOfDay.Morning, label: "Morning" },
    { value: PeriodOfDay.Afternoon, label: "Afternoon" },
    { value: PeriodOfDay.Evening, label: "Evening" },
  ];

  const handleDatePickerChange: SingleChange = ({ date }) => {
    if (date) {
      onSelectionChange({ date: new Date(date?.valueOf()) });
    }
  };

  const toggleDatePicker = () => {
    if (!showDatePicker) {
      onSelectionChange({ date: new Date() });
    }
    setShowDatePicker(!showDatePicker);
  };

  const handlePressToggleButton = (option: string) => {
    switch (option) {
      case PeriodOfDay.Morning:
      case PeriodOfDay.Afternoon:
      case PeriodOfDay.Evening:
        onSelectionChange({ periodOfDay: option });
        break;
      case "now":
        onSelectionChange({ now: true });
        break;
      default:
        onSelectionChange({ date: new Date() });
        break;
    }
  };

  return (
    <View>
      <ThemedText>
        <ThemedText style={styles.bold}>Date: </ThemedText>
        {currentDateFormatted}
      </ThemedText>
      <ThemedToggleButtons
        buttonContainerStyle={{ height: Sizes.buttonHeight }}
        label=""
        selectedOption={value && ("periodOfDay" in value ? value.periodOfDay : "now" in value ? "now" : null)}
        columns={4}
        options={presetOptions}
        onChangeSelection={handlePressToggleButton}
      />
      <ThemedButton title="Custom" mode="toggle" onPress={toggleDatePicker} style={styles.dateSelectionButton} />
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
            date={value && "date" in value ? value.date : null}
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
    bold: {
      fontWeight: 700,
    },
  });

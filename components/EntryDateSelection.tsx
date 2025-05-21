import { Sizes } from "@/constants/Sizes";
import { PeriodOfDay, type EntryDateInformation } from "@/db/schema";
import useStyles from "@/hooks/useStyles";
import { useCallback, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import type { SingleChange } from "react-native-ui-datepicker/lib/typescript/types";
import type { ThemedColors } from "@/contexts/ThemeContext";
import ThemedToggleButtons from "./ThemedToggleButtons";
import { type FieldValues, type Path, type ControllerProps, Controller } from "react-hook-form";
import { ThemedText } from "./ThemedText";
import { formatEntryDateInformation } from "@/utils/entryDate";
import SectionList from "./SectionList";
import ActionableListItem from "./ActionableListItem";
import { EntryDateSelectionBottomSheet } from "./BottomSheets/EntryDateSelectionBottomSheet";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

export interface EntryDateSelectionProps {
  onSelectionChange: (data: EntryDateInformation) => void;
  value?: EntryDateInformation;
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

  const { styles } = useStyles(createStyles);

  const currentDateFormatted = useMemo(() => (value ? formatEntryDateInformation(value) : "-"), [value]);
  const dateSelectionBottomSheet = useRef<BottomSheetModal>(null);
  const presetOptions = useMemo(
    () => [
      { value: "now", label: "Now" },
      { value: PeriodOfDay.Morning, label: "Morning" },
      { value: PeriodOfDay.Afternoon, label: "Afternoon" },
      { value: PeriodOfDay.Evening, label: "Evening" },
    ],
    [],
  );

  const handleDatePickerChange: SingleChange = ({ date }) => {
    if (date) {
      onSelectionChange({
        date: new Date(date?.valueOf()),
        periodOfDay: value?.periodOfDay ? value?.periodOfDay : undefined,
      });
    }
  };

  const showDatePicker = useCallback(() => {
    onSelectionChange({
      date: value?.date ? value?.date : new Date(),
      periodOfDay: value?.periodOfDay ? value.periodOfDay : undefined,
    });

    dateSelectionBottomSheet.current?.present();
  }, [value, onSelectionChange]);

  const handlePressToggleButton = useCallback(
    (option: string | null) => {
      switch (option) {
        case PeriodOfDay.Morning:
        case PeriodOfDay.Afternoon:
        case PeriodOfDay.Evening:
          onSelectionChange({
            date: value?.date ? value.date : new Date(),
            periodOfDay: option,
          });
          break;
        case "now":
          onSelectionChange({ now: true });
          break;
        default:
          // If unselecting an option
          onSelectionChange({
            date: value?.date ? value.date : new Date(),
          });
          break;
      }
    },
    [onSelectionChange, value],
  );

  const listData = useMemo(
    () => [
      {
        data: [
          {
            key: "change-date",
            render: (
              <ActionableListItem
                title={
                  <ThemedText>
                    <ThemedText style={styles.bold}>Date: </ThemedText>
                    {currentDateFormatted}
                  </ThemedText>
                }
                onPress={showDatePicker}
              />
            ),
          },
          {
            key: "date-presets",
            render: (
              <ThemedToggleButtons
                containerStyle={{ marginBottom: 0, padding: Sizes.medium }}
                buttonContainerStyle={{ height: Sizes.buttonHeight }}
                label=""
                selectedOption={value?.periodOfDay ? value.periodOfDay : value?.now ? "now" : null}
                columns={4}
                options={presetOptions}
                onChangeSelection={handlePressToggleButton}
              />
            ),
          },
        ],
      },
    ],
    [currentDateFormatted, value, styles, presetOptions, showDatePicker, handlePressToggleButton],
  );

  return (
    <View>
      <SectionList sections={listData} />

      <EntryDateSelectionBottomSheet
        ref={dateSelectionBottomSheet}
        date={value?.date ? value.date : null}
        onChange={handleDatePickerChange}
      />
    </View>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    dateSelectionButton: {
      marginBottom: Sizes.small,
      flex: 1,
    },
    datePickerContainer: {
      flex: 1,
      width: "100%",
    },
    bold: {
      fontWeight: 700,
      fontSize: 18,
    },
  });

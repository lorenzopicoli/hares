import React from "react";
import { Controller, type ControllerProps, type FieldValues, type Path } from "react-hook-form";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ThemedInputLabel from "./ThemedInputLabel";
import type { ThemedColors } from "@/contexts/ThemeContext";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

type WeekdaySelectorProps = {
  label?: string;
  selectedDays: boolean[];
  onChange: (selectedDays: boolean[]) => void;
};

export function WeekdaySelector({ selectedDays, label, onChange }: WeekdaySelectorProps) {
  const { styles } = useStyles(createStyles);
  const toggleDay = (index: number) => {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[index] = !newSelectedDays[index];
    onChange(newSelectedDays);
  };

  return (
    <View>
      {label && <ThemedInputLabel label={label} />}
      <View style={styles.container}>
        {WEEKDAYS.map((day, index) => (
          <TouchableOpacity
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            style={[styles.dayCircle, selectedDays[index] ? styles.selected : styles.unselected]}
            onPress={() => toggleDay(index)}
          >
            <Text style={[styles.dayText, selectedDays[index] ? styles.selectedText : styles.unselectedText]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

type FormWeekdaySelectorProps<T extends FieldValues, K extends Path<T>> = Omit<
  WeekdaySelectorProps,
  "selectedDays" | "onChange"
> & {
  form: Omit<ControllerProps<T, K, T>, "render">;
};

export default function FormWeekdaySelector<T extends FieldValues, K extends Path<T>>(
  props: FormWeekdaySelectorProps<T, K>,
) {
  const { form, ...inputProps } = props;

  return (
    <Controller
      {...form}
      render={({ field: { onChange, value } }) => {
        const selectedDays = Array.isArray(value) ? value : Array(7).fill(false);

        return (
          <WeekdaySelector
            {...inputProps}
            selectedDays={selectedDays}
            onChange={(newSelectedDays) => onChange(newSelectedDays)}
          />
        );
      }}
    />
  );
}

// Styles
const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dayCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: Sizes.xSmall,
    },
    selected: {
      backgroundColor: theme.toggleButton.selected.background,
      borderWidth: 0.5,
      borderColor: theme.toggleButton.selected.border,
    },
    unselected: {
      borderWidth: 0.5,
      backgroundColor: theme.toggleButton.background,
      borderColor: theme.toggleButton.border,
    },
    dayText: {
      fontSize: 16,
    },
    selectedText: {
      color: theme.text,
    },
    unselectedText: {
      color: theme.secondaryText,
    },
  });

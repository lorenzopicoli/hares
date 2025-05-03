import { useColors, type ThemedColors } from "../ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { ThemedView } from "../ThemedView";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheet } from "../BottomSheet";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import type { DateType, RangeChange } from "react-native-ui-datepicker/lib/typescript/types";
import { Sizes } from "@/constants/Sizes";
import { StyleSheet, View } from "react-native";
import { YStack } from "../Stacks";
import ThemedToggleButtons from "../ThemedToggleButtons";
import { endOfDay, startOfDay, subMonths, subWeeks } from "date-fns";

export interface StatsDateRange {
  startDate: Date;
  endDate: Date;
}

type StatsScreenOptionsBottomSheetProps = {
  onDateRangeChange?: (range: StatsDateRange) => void;
  initialDate: StatsDateRange;
};

export const StatsScreenOptionsBottomSheet = forwardRef<BottomSheetModal, StatsScreenOptionsBottomSheetProps>(
  (props, ref) => {
    const { styles } = useStyles(createStyles);
    const { colors } = useColors();
    const datePickerDefaultStyles = useDefaultStyles();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [selectedPreset, setSelectedPreset] = useState<"lastMonth" | "lastWeek" | "last3Months" | null>();
    const [date, setDate] = useState<{ startDate: DateType; endDate: DateType }>({
      startDate: props.initialDate.startDate,
      endDate: props.initialDate.endDate,
    });

    useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheetModal);

    const onChange: RangeChange = useCallback(
      (range) => {
        setDate(range);
        if (!range.startDate || !range.endDate) {
          return;
        }

        const newDate: StatsDateRange = {
          startDate: new Date(range.startDate.valueOf()),
          endDate: new Date(range.endDate.valueOf()),
        };
        props.onDateRangeChange?.(newDate);
        setSelectedPreset(null);
      },
      [props.onDateRangeChange],
    );

    const handlePresetChange = (preset: "lastMonth" | "lastWeek" | "last3Months" | null) => {
      let newDate: StatsDateRange;
      switch (preset) {
        case "lastMonth":
          newDate = {
            startDate: startOfDay(subMonths(new Date(), 1)),
            endDate: endOfDay(new Date()),
          };
          break;
        case "lastWeek":
          newDate = {
            startDate: startOfDay(subWeeks(new Date(), 1)),
            endDate: endOfDay(new Date()),
          };
          break;
        case "last3Months":
          newDate = {
            startDate: startOfDay(subMonths(new Date(), 3)),
            endDate: endOfDay(new Date()),
          };
          break;

        default:
          newDate = {
            startDate: startOfDay(subMonths(new Date(), 3)),
            endDate: endOfDay(new Date()),
          };
          break;
      }
      setSelectedPreset(preset);
      setDate(newDate);
      props.onDateRangeChange?.(newDate);
    };

    return (
      <BottomSheet showHandle snapPoints={[360]} ref={bottomSheetRef}>
        <ThemedView>
          <YStack style={styles.container}>
            <View style={{ width: "100%", height: Sizes.buttonHeight }}>
              <ThemedToggleButtons
                columns={3}
                allowUnselect
                options={[
                  { label: "Last Month", value: "lastMonth" },
                  { label: "Last Week", value: "lastWeek" },
                  { label: "Last 3 Months", value: "last3Months" },
                ]}
                selectedOption={selectedPreset}
                buttonContainerStyle={{ height: Sizes.buttonHeight }}
                onChangeSelection={handlePresetChange}
              />
            </View>
            <ThemedView>
              <DateTimePicker
                mode="range"
                startDate={date?.startDate}
                endDate={date?.endDate}
                onChange={onChange}
                styles={{
                  ...datePickerDefaultStyles,
                  range_middle: { backgroundColor: colors.darkTint },
                  selected: { backgroundColor: colors.tint },
                  range_start_label: { color: colors.text },
                  range_end_label: { color: colors.text },
                  selected_label: { color: colors.text },
                  day_label: { color: colors.text },
                  range_middle_label: { color: colors.text },
                  today: { backgroundColor: colors.secondaryBackground },
                }}
              />
            </ThemedView>
          </YStack>
        </ThemedView>
      </BottomSheet>
    );
  },
);

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: Sizes.medium,
    },
  });

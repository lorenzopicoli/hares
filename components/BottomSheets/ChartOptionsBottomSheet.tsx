import { StyleSheet } from "react-native";
import { useColors, type ThemedColors } from "../ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";
import { ThemedView } from "../ThemedView";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheet } from "../BottomSheet";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import type { DateType, RangeChange } from "react-native-ui-datepicker/lib/typescript/types";

export interface StatsDateRange {
  startDate: Date;
  endDate: Date;
}

type ChartOptionsBottomSheetProps = {
  onDateRangeChange?: (range: StatsDateRange) => void;
};

export const ChartOptionsBottomSheet = forwardRef<BottomSheetModal, ChartOptionsBottomSheetProps>((props, ref) => {
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();
  const datePickerDefaultStyles = useDefaultStyles();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [date, setDate] = useState<{ startDate: DateType; endDate: DateType }>();

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
    },
    [props.onDateRangeChange],
  );

  return (
    <BottomSheet showHandle snapPoints={[400]} ref={bottomSheetRef}>
      <ThemedView style={styles.container}>
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
    </BottomSheet>
  );
});

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: Sizes.medium,
    },
  });

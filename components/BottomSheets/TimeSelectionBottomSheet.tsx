import type { ThemedColors } from "@/contexts/ThemeContext";
import { ThemedView } from "../ThemedView";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheet } from "../BottomSheet";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import type { SingleChange } from "react-native-ui-datepicker/lib/typescript/types";
import { Sizes } from "@/constants/Sizes";
import { StyleSheet } from "react-native";
import useStyles from "@/hooks/useStyles";

export type TimeSelectionBottomSheetProps = {
  onChange: SingleChange;
  date: Date | undefined | null;
};

export const TimeSelectionBottomSheet = forwardRef<BottomSheetModal, TimeSelectionBottomSheetProps>((props, ref) => {
  const datePickerDefaultStyles = useDefaultStyles();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { styles } = useStyles(createStyles);

  useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheetModal);

  return (
    <BottomSheet enableContentPanningGesture={false} snapPoints={[200]} ref={bottomSheetRef}>
      <ThemedView style={styles.container}>
        <DateTimePicker
          mode="single"
          initialView="time"
          timePicker
          hideHeader
          disableMonthPicker
          disableYearPicker
          style={{ marginTop: -20 }}
          date={props.date}
          onChange={props.onChange}
          styles={{
            ...datePickerDefaultStyles,
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

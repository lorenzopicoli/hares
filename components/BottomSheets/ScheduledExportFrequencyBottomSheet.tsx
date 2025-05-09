import { StyleSheet } from "react-native";
import { YStack } from "../Stacks";
import type { ThemedColors } from "../ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";
import { ThemedView } from "../ThemedView";
import BottomSheetListItem from "../BottomSheetListItem";
import { Separator } from "../Separator";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheet } from "../BottomSheet";

export type ScheduledExportFrequencyBottomSheetProps = {
  onFrequencyChange: (frequency: number | null) => void;
};

export const ScheduledExportFrequencyBottomSheet = forwardRef<
  BottomSheetModal,
  ScheduledExportFrequencyBottomSheetProps
>((props, ref) => {
  const { styles } = useStyles(createStyles);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheetModal);

  return (
    <BottomSheet showHandle snapPoints={[200]} ref={bottomSheetRef}>
      <ThemedView>
        <YStack style={styles.container}>
          <BottomSheetListItem title="Every 3 hours" onPress={() => props.onFrequencyChange(3)} />
          <Separator containerBackgroundColor="transparent" />
          <BottomSheetListItem title="Every 6 hours" onPress={() => props.onFrequencyChange(6)} />
          <Separator containerBackgroundColor="transparent" />
          <BottomSheetListItem title="Every 12 hours" onPress={() => props.onFrequencyChange(12)} />
          <Separator containerBackgroundColor="transparent" />
          <BottomSheetListItem title="Every day" onPress={() => props.onFrequencyChange(24)} />
          <Separator containerBackgroundColor="transparent" />
          <BottomSheetListItem title="Every week" onPress={() => props.onFrequencyChange(7 * 24)} />
          <Separator containerBackgroundColor="transparent" />
          <BottomSheetListItem title="Every month" onPress={() => props.onFrequencyChange(31 * 24)} />
          <Separator containerBackgroundColor="transparent" />
          <BottomSheetListItem title="Never" onPress={() => props.onFrequencyChange(null)} />
        </YStack>
      </ThemedView>
    </BottomSheet>
  );
});

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Sizes.large,
    },
  });

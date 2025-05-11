import { StyleSheet, View } from "react-native";
import type { ThemedColors } from "@/contexts/ThemeContext";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheet } from "../BottomSheet";
import { YStack } from "../Stacks";
import ThemedInput from "../ThemedInput";

type RankingChartOptionsBottomSheet = {
  onChangeLimit?: (limit: number) => void;
  initialLimit: number;
};

export const RankingChartOptionsBottomSheet = forwardRef<BottomSheetModal, RankingChartOptionsBottomSheet>(
  (props, ref) => {
    const { initialLimit, onChangeLimit } = props;
    const { styles } = useStyles(createStyles);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheetModal);

    const handleTextChange = (text: string) => {
      onChangeLimit?.(+text);
    };

    return (
      <BottomSheet showHandle snapPoints={[150]} ref={bottomSheetRef}>
        <YStack gap={Sizes.small} style={styles.container}>
          <View style={styles.flex}>
            <ThemedInput
              label="Items in ranking:"
              defaultValue={String(initialLimit)}
              keyboardType="numeric"
              onChangeText={handleTextChange}
            />
          </View>
        </YStack>
      </BottomSheet>
    );
  },
);

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: Sizes.medium,
      paddingHorizontal: Sizes.large,
    },
    flex: {
      flex: 1,
      width: "50%",
    },
  });

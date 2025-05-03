import { StyleSheet, View } from "react-native";
import type { ThemedColors } from "../ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheet } from "../BottomSheet";
import { YStack } from "../Stacks";
import ThemedInput from "../ThemedInput";

type RankingChartOptionsBottomSheet = {
  onChangeNCols?: (nCols: number) => void;
  initialNCols: number;
};

export const TrackerGridSettingsBottomSheet = forwardRef<BottomSheetModal, RankingChartOptionsBottomSheet>(
  (props, ref) => {
    const { initialNCols, onChangeNCols } = props;
    const { styles } = useStyles(createStyles);
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [nCols, setNCols] = useState(String(initialNCols));

    useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheetModal);

    const handleDismiss = () => {
      onChangeNCols?.(+nCols);
    };

    return (
      <BottomSheet showHandle snapPoints={[150]} ref={bottomSheetRef} onDismiss={handleDismiss}>
        <YStack gap={Sizes.small} style={styles.container}>
          <View style={styles.flex}>
            <ThemedInput label="Number of columns:" keyboardType="numeric" autoFocus onChangeText={setNCols} />
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

import { StyleSheet } from "react-native";
import { YStack } from "../Stacks";
import { useColors, type ThemedColors } from "../ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Sizes } from "@/constants/Sizes";
import { ThemedView } from "../ThemedView";
import BottomSheetListItem from "../BottomSheetListItem";
import { Separator } from "../Separator";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { useRouter } from "expo-router";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheet } from "../BottomSheet";
import { ThemedText } from "../ThemedText";
import { useDeleteTracker } from "@/hooks/data/useDeleteTracker";

export type TrackerOptionsBottomSheetRef = BottomSheetModal & {
  presentWithTrackerId: (trackerId: number) => void;
};

export const TrackerOptionsBottomSheet = forwardRef<TrackerOptionsBottomSheetRef>((_props, ref) => {
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();
  const router = useRouter();
  const { deleteTracker } = useDeleteTracker();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const trackerIdRef = useRef<number>(-1);

  useImperativeHandle(ref, () => {
    const sheetRef = bottomSheetRef.current as TrackerOptionsBottomSheetRef;

    sheetRef.presentWithTrackerId = (trackerId: number) => {
      trackerIdRef.current = trackerId;
      bottomSheetRef.current?.present();
    };

    return sheetRef;
  });

  const handleEditTracker = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    router.navigate({ pathname: "/tracker/addTracker", params: { trackerId: trackerIdRef.current } });
  }, [router]);

  const handleDeleteTracker = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    deleteTracker(trackerIdRef.current);
  }, [deleteTracker]);

  return (
    <BottomSheet snapPoints={[150]} ref={bottomSheetRef}>
      <ThemedView>
        <YStack style={styles.container}>
          <BottomSheetListItem
            title="Edit tracker"
            left={<MaterialIcons name="mode-edit" size={20} color={colors.text} />}
            onPress={handleEditTracker}
          />
          <Separator containerBackgroundColor="transparent" />
          <BottomSheetListItem
            title={<ThemedText style={styles.danger}>Delete Tracker</ThemedText>}
            left={<MaterialCommunityIcons name="delete" size={20} color={colors.button.danger.background} />}
            onPress={handleDeleteTracker}
          />
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
    danger: {
      color: theme.button.danger.background,
    },
  });

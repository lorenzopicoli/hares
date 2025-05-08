import { StyleSheet } from "react-native";
import { YStack } from "../Stacks";
import { useColors, type ThemedColors } from "../ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Entypo } from "@expo/vector-icons";
import { Sizes } from "@/constants/Sizes";
import { ThemedView } from "../ThemedView";
import BottomSheetListItem from "../BottomSheetListItem";
import { Separator } from "../Separator";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { useRouter } from "expo-router";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheet } from "../BottomSheet";

interface TrackScreenBottomSheetProps {
  collectionId?: number;
}

export const TrackScreenBottomSheet = forwardRef<BottomSheetModal, TrackScreenBottomSheetProps>((props, ref) => {
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheetModal);

  const handleAddTracker = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    router.navigate("/tracker/addTracker");
  }, [router]);

  const handleAddCollection = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    router.navigate("/collection/addCollection");
  }, [router]);

  return (
    <BottomSheet snapPoints={[170]} ref={bottomSheetRef}>
      <ThemedView>
        <YStack style={styles.container}>
          <BottomSheetListItem
            title="Add tracker"
            left={<Entypo name="news" size={20} color={colors.text} />}
            onPress={handleAddTracker}
          />
          <Separator containerBackgroundColor="transparent" />
          <BottomSheetListItem
            title="Add collection"
            left={<Entypo name="folder" size={20} color={colors.text} />}
            onPress={handleAddCollection}
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
  });

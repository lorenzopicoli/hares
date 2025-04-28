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
import { useDeleteEntry } from "@/hooks/data/useDeleteEntry";

export type EntryOptionsBottomSheetRef = BottomSheetModal & {
  presentWithEntryId: (entryId: number, trackerId: number) => void;
};

export const EntryOptionsBottomSheet = forwardRef<EntryOptionsBottomSheetRef>((_props, ref) => {
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();
  const router = useRouter();
  const { deleteEntry } = useDeleteEntry();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const trackerIdRef = useRef<number>(-1);
  const entryIdRef = useRef<number>(-1);

  useImperativeHandle(ref, () => {
    const sheetRef = bottomSheetRef.current as EntryOptionsBottomSheetRef;

    sheetRef.presentWithEntryId = (entryId: number, trackerId: number) => {
      trackerIdRef.current = trackerId;
      entryIdRef.current = entryId;
      bottomSheetRef.current?.present();
    };

    return sheetRef;
  });

  const handleEditEntry = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    router.navigate({
      pathname: "/entry/addEntry",
      params: { entryId: entryIdRef.current, trackerId: trackerIdRef.current },
    });
  }, [router]);

  const handleDeleteEntry = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    deleteEntry(entryIdRef.current);
  }, [deleteEntry]);

  return (
    <BottomSheet snapPoints={[150]} ref={bottomSheetRef}>
      <ThemedView>
        <YStack style={styles.container}>
          <BottomSheetListItem
            title="Edit entry"
            left={<MaterialIcons name="mode-edit" size={20} color={colors.text} />}
            onPress={handleEditEntry}
          />
          <Separator containerBackgroundColor="transparent" />
          <BottomSheetListItem
            title={<ThemedText style={styles.danger}>Delete entry</ThemedText>}
            left={<MaterialCommunityIcons name="delete" size={20} color={colors.button.danger.background} />}
            onPress={handleDeleteEntry}
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

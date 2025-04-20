import { useColors } from "@/components/ThemeProvider";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useMemo, useCallback } from "react";
import { useDeleteEntry } from "./data/useDeleteEntry";
import { useRouter } from "expo-router";
import type { TrackerEntry } from "@/db/schema";

export function useEntryActions() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors } = useColors();
  const { deleteEntry } = useDeleteEntry();
  const router = useRouter();

  const actionSheetParams = useMemo(() => {
    const options = ["Edit", "Delete", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    const dangerButtonIndex = options.length - 2;
    return {
      options,
      cancelButtonIndex,
      dangerButtonIndex,
      containerStyle: { backgroundColor: colors.background },
      textStyle: { color: colors.text },
    };
  }, [colors.text, colors.background]);

  const handleEntryActions = useCallback(
    (entry: TrackerEntry) => {
      showActionSheetWithOptions(actionSheetParams, async (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            router.navigate({ pathname: "/entry/addEntry", params: { entryId: entry.id, trackerId: entry.trackerId } });
            break;

          case 1:
            await deleteEntry(entry.id);
            break;

          case 2:
            break;

          default:
        }
      });
    },
    [deleteEntry, showActionSheetWithOptions, router, actionSheetParams],
  );

  return { handleEntryActions };
}

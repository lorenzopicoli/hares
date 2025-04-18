import { useColors } from "@/components/ThemeProvider";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useMemo, useCallback } from "react";
import { useDeleteEntry } from "./data/useDeleteEntry";

export function useEntryActions() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors } = useColors();
  const { deleteEntry } = useDeleteEntry();

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
    (entryId: number) => {
      showActionSheetWithOptions(actionSheetParams, async (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            console.log("Edit");
            break;

          case 1:
            await deleteEntry(entryId);
            break;

          case 2:
            break;

          default:
        }
      });
    },
    [deleteEntry, showActionSheetWithOptions, actionSheetParams],
  );

  return { handleEntryActions };
}

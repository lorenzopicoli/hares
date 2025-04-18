import { useColors } from "@/components/ThemeProvider";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useRouter } from "expo-router";
import { useMemo, useCallback } from "react";
import { useDeleteTracker } from "./data/useDeleteTracker";

export function useTrackScreenActions(collectionId: number) {
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors } = useColors();

  const actionSheetParams = useMemo(() => {
    const actionSheetOptions =
      collectionId === -1
        ? ["Add tracker", "Add collection", "Cancel"]
        : ["Add tracker", "Add collection", "Edit current collection", "Cancel"];
    const cancelButtonIndex = actionSheetOptions.length - 1;
    return {
      options: actionSheetOptions,
      cancelButtonIndex,
      containerStyle: { backgroundColor: colors.background },
      textStyle: { color: colors.text },
    };
  }, [colors.text, colors.background, collectionId]);

  const handleTrackScreenOptions = useCallback(() => {
    showActionSheetWithOptions(actionSheetParams, (selectedIndex?: number) => {
      switch (selectedIndex) {
        case 0:
          router.navigate("/tracker/addTracker");
          break;

        case 1:
          router.navigate("/collection/addCollection");
          break;

        case 2:
          if (collectionId !== -1) {
            router.navigate({
              pathname: "/collection/addCollection",
              params: { collectionId },
            });
          }
          break;

        default:
      }
    });
  }, [router, collectionId, showActionSheetWithOptions, actionSheetParams]);

  return { handleTrackScreenOptions };
}

export function useTrackerActions() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors } = useColors();
  const { deleteTracker } = useDeleteTracker();

  const actionSheetParams = useMemo(() => {
    const options = ["Edit", "Delete (entries are kept)", "Cancel"];
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

  const handleTrackerActions = useCallback(
    (trackerId: number) => {
      showActionSheetWithOptions(actionSheetParams, async (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            console.log("Edit");
            break;

          case 1:
            await deleteTracker(trackerId);
            break;

          case 2:
            break;

          default:
        }
      });
    },
    [deleteTracker, showActionSheetWithOptions, actionSheetParams],
  );

  return { handleTrackerActions };
}

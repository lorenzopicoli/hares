import { useColors } from "@/components/ThemeProvider";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useRouter } from "expo-router";
import { useMemo, useCallback } from "react";

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

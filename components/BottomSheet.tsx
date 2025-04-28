import { BackHandler, StyleSheet, type NativeEventSubscription } from "react-native";
import type { ThemedColors } from "@/components/ThemeProvider";
import { forwardRef, useCallback, useImperativeHandle, useRef, type ReactNode } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import { ThemedView } from "@/components/ThemedView";
import useStyles from "@/hooks/useStyles";
import type { SharedValue } from "react-native-reanimated";

export interface BottomSheetProps extends BottomSheetModalProps {
  snapPoints: (string | number)[] | SharedValue<(string | number)[]>;
  showHandle?: boolean;
  children: ReactNode;
}

export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>((props, ref) => {
  const { snapPoints, children, showHandle } = props;
  const { styles } = useStyles(createStyles);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { handleSheetPositionChange } = useBottomSheetBackHandler(bottomSheetRef);

  useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheetModal);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} appearsOnIndex={1} />,
    [],
  );

  return (
    <>
      <BottomSheetModal
        {...props}
        // detached={true}
        enableDismissOnClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.bottomSheetIndicatorStyle}
        handleComponent={showHandle ? undefined : () => null}
        backgroundStyle={styles.bottomSheetBackgroundContainer}
        style={styles.bottomSheetContainer}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetPositionChange}
        ref={bottomSheetRef}
      >
        <BottomSheetView style={styles.bottomSheetContainer}>
          <ThemedView>{children}</ThemedView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
});

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    bottomSheetBackgroundContainer: {
      backgroundColor: theme.background,
      flex: 1,
    },
    bottomSheetContainer: {
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      backgroundColor: theme.background,
      //   marginHorizontal: 7,
      flex: 1,
    },
    bottomSheetIndicatorStyle: {
      backgroundColor: theme.text,
    },
  });
/**
 * hook that dismisses the bottom sheet on the hardware back button press if it is visible
 * @param bottomSheetRef ref to the bottom sheet which is going to be closed/dismissed on the back press
 */
export const useBottomSheetBackHandler = (bottomSheetRef: React.RefObject<BottomSheetModal | null>) => {
  const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleSheetPositionChange = useCallback<NonNullable<BottomSheetModalProps["onChange"]>>(
    (index) => {
      const isBottomSheetVisible = index >= 0;
      if (isBottomSheetVisible && !backHandlerSubscriptionRef.current) {
        // setup the back handler if the bottom sheet is right in front of the user
        backHandlerSubscriptionRef.current = BackHandler.addEventListener("hardwareBackPress", () => {
          bottomSheetRef.current?.dismiss();
          return true;
        });
      } else if (!isBottomSheetVisible) {
        backHandlerSubscriptionRef.current?.remove();
        backHandlerSubscriptionRef.current = null;
      }
    },
    [bottomSheetRef, backHandlerSubscriptionRef],
  );
  return { handleSheetPositionChange };
};

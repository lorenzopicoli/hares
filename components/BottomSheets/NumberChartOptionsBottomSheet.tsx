import { StyleSheet } from "react-native";
import type { ThemedColors } from "../ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheet } from "../BottomSheet";
import { DateGroupingPeriod } from "@/utils/dateGroupPeriod";
import BottomSheetListItem from "../BottomSheetListItem";
import RadioButton from "../RadioButton";
import { XStack, YStack } from "../Stacks";
import { ThemedText } from "../ThemedText";
import { GroupFunction } from "@/utils/groupFunctions";
import { Separator } from "../Separator";

type NumberChartOptionsBottomSheet = {
  onChangeGroupPeriod?: (groupingPeriod: DateGroupingPeriod) => void;
  onChangeGroupFun?: (groupingFun: GroupFunction) => void;
  groupPeriod?: DateGroupingPeriod;
  groupFun?: GroupFunction;
};

export const NumberChartOptionsBottomSheet = forwardRef<BottomSheetModal, NumberChartOptionsBottomSheet>(
  (props, ref) => {
    const { groupFun, groupPeriod, onChangeGroupFun, onChangeGroupPeriod } = props;
    const { styles } = useStyles(createStyles);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheetModal);

    return (
      <BottomSheet showHandle snapPoints={[groupPeriod && groupFun ? 330 : 150]} ref={bottomSheetRef}>
        <YStack gap={Sizes.small} style={styles.container}>
          {groupPeriod ? (
            <>
              <ThemedText
                style={{
                  paddingHorizontal: Sizes.medium,
                  paddingVertical: Sizes.small,
                }}
                type="subtitle"
              >
                Time period:
              </ThemedText>
              <XStack flexWrap="wrap" gap={Sizes.small}>
                <BottomSheetListItem
                  title="Daily"
                  left={<RadioButton checked={groupPeriod === DateGroupingPeriod.daily} />}
                  right={null}
                  onPress={() => onChangeGroupPeriod?.(DateGroupingPeriod.daily)}
                  fullWidth={false}
                />
                <BottomSheetListItem
                  title="Weekly"
                  left={<RadioButton checked={groupPeriod === DateGroupingPeriod.weekly} />}
                  right={null}
                  onPress={() => onChangeGroupPeriod?.(DateGroupingPeriod.weekly)}
                  fullWidth={false}
                />
                <BottomSheetListItem
                  title="Monthly"
                  left={<RadioButton checked={groupPeriod === DateGroupingPeriod.monthly} />}
                  right={null}
                  onPress={() => onChangeGroupPeriod?.(DateGroupingPeriod.monthly)}
                  fullWidth={false}
                />
                <BottomSheetListItem
                  title="Yearly"
                  left={<RadioButton checked={groupPeriod === DateGroupingPeriod.yearly} />}
                  right={null}
                  onPress={() => onChangeGroupPeriod?.(DateGroupingPeriod.yearly)}
                  fullWidth={false}
                />
              </XStack>
            </>
          ) : null}
          {groupFun ? (
            <>
              <Separator containerBackgroundColor="transparent" />
              <ThemedText
                style={{
                  paddingHorizontal: Sizes.medium,
                  paddingVertical: Sizes.small,
                }}
                type="subtitle"
              >
                Calculation method:
              </ThemedText>
              <XStack flexWrap="wrap" gap={Sizes.small}>
                <BottomSheetListItem
                  title="Average"
                  left={<RadioButton checked={groupFun === GroupFunction.avg} />}
                  right={null}
                  onPress={() => onChangeGroupFun?.(GroupFunction.avg)}
                  fullWidth={false}
                />
                <BottomSheetListItem
                  title="Sum"
                  left={<RadioButton checked={groupFun === GroupFunction.sum} />}
                  right={null}
                  onPress={() => onChangeGroupFun?.(GroupFunction.sum)}
                  fullWidth={false}
                />
                <BottomSheetListItem
                  title="Max"
                  left={<RadioButton checked={groupFun === GroupFunction.max} />}
                  right={null}
                  onPress={() => onChangeGroupFun?.(GroupFunction.max)}
                  fullWidth={false}
                />
                <BottomSheetListItem
                  title="Min"
                  left={<RadioButton checked={groupFun === GroupFunction.min} />}
                  right={null}
                  onPress={() => onChangeGroupFun?.(GroupFunction.min)}
                  fullWidth={false}
                />
              </XStack>
            </>
          ) : null}
        </YStack>
      </BottomSheet>
    );
  },
);

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: Sizes.medium,
    },
  });

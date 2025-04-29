import { StyleSheet, Switch } from "react-native";
import { useColors, type ThemedColors } from "../ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";
import { ThemedView } from "../ThemedView";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useRouter } from "expo-router";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheet } from "../BottomSheet";
import ActionableListItem from "../ActionableListItem";
import type { ISection } from "../SectionList";
import { ThemedText } from "../ThemedText";
import SectionList from "../SectionList";

type ChartOptionsBottomSheetProps = {};

export const ChartOptionsBottomSheet = forwardRef<BottomSheetModal, ChartOptionsBottomSheetProps>((props, ref) => {
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheetModal);

  const settingsData: ISection[] = [
    {
      data: [
        {
          key: "theme",
          render: (
            <ActionableListItem
              title="Dark mode"
              //   onPress={toggleTheme}
              right={<Switch value={true} />}
            />
          ),
        },
      ],
    },
    {
      title: <ThemedText type="title">Data Management</ThemedText>,
      data: [
        {
          key: "reload-db",
          render: <ActionableListItem title="Reload database" />,
        },
        {
          key: "export-data",
          render: <ActionableListItem title="Export Data" />,
        },
        {
          key: "import-data",
          render: <ActionableListItem title="Import Data" />,
        },
        {
          key: "delete-data",
          render: <ActionableListItem title="Delete All Data" />,
        },
      ],
    },
  ];

  return (
    <BottomSheet showHandle snapPoints={[400]} ref={bottomSheetRef}>
      <ThemedView>
        <SectionList style={styles.list} sections={settingsData} />
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
    list: {
      paddingHorizontal: Sizes.medium,
    },
  });

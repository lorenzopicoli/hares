import { Platform, StyleSheet, Switch } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { Sizes } from "@/constants/Sizes";
import { useCounts } from "@/hooks/data/useCounts";
import { useDeleteDatabase } from "@/hooks/useDeleteDatabase";
import { useColors, type ThemedColors } from "@/components/ThemeProvider";
import SectionList, { type ISection } from "@/components/SectionList";
import ActionableListItem from "@/components/ActionableListItem";
import TextListItem from "@/components/TextListItem";
import { useRef, useState } from "react";
import useStyles from "@/hooks/useStyles";
import { BottomSheet, useBottomSheetBackHandler } from "@/components/BottomSheet";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import ExportDatabaseBottomSheetView, {
  EXPORT_DATABASE_BOTTOM_SHEET_HEIGHT,
} from "@/components/BottomSheets/ExportDatabaseBottomSheet";
import ImportDatabaseBottomSheet, {
  IMPORT_DATABASE_BOTTOM_SHEET_HEIGHT,
} from "@/components/BottomSheets/ImportDatabaseBottomSheet";
import { ThemedView } from "@/components/ThemedView";
import { useSettings } from "@/components/SettingsProvieder";
import { TrackerGridSettingsBottomSheet } from "@/components/BottomSheets/TrackerGridSettingsBottomSheet";
import { useScheduledExport } from "@/hooks/useScheduledExport";
import { ScheduledExportFrequencyBottomSheet } from "@/components/BottomSheets/ScheduledExportFrequencyBottomSheet";

export default function SettingsScreen() {
  const { reloadDb } = useDatabase();
  const { collectionsCount, trackersCount, entriesCount } = useCounts();
  const { confirm, ConfirmModal } = useConfirmModal();
  const { deleteDatabase } = useDeleteDatabase();
  const { colors, theme, setTheme } = useColors();
  const { settings, updateSettings } = useSettings();
  const [localTheme, setLocalTheme] = useState(theme);
  const [localShowAllCollection, setLocalShowAllCollection] = useState(settings.showAllCollection);
  const { styles } = useStyles(createStyles);

  const trackerGridSettingsSheet = useRef<BottomSheetModal>(null);
  const scheduledExportFrequencySheet = useRef<BottomSheetModal>(null);
  const exportDbSheetRef = useRef<BottomSheetModal>(null);
  const importDbSheetRef = useRef<BottomSheetModal>(null);
  const { handleSheetPositionChange: exportSheetChange } = useBottomSheetBackHandler(exportDbSheetRef);
  const { handleSheetPositionChange: importSheetChange } = useBottomSheetBackHandler(importDbSheetRef);
  const { setExportFrequency, exportFrequency, currentExportFolder, requestFolderAccess, setupScheduledExport } =
    useScheduledExport();

  const showTrackerGridSettings = () => {
    trackerGridSettingsSheet.current?.present();
  };

  const showExportDbSheet = () => {
    exportDbSheetRef.current?.present();
  };

  const showImportDbSheet = () => {
    importDbSheetRef.current?.present();
  };

  const showExportFrequencySheet = () => {
    scheduledExportFrequencySheet.current?.present();
  };

  const handleChangeExportFrequency = (frequency: number | null) => {
    setExportFrequency(frequency);
    scheduledExportFrequencySheet.current?.dismiss();
  };

  const handleShowExportLogs = () => {};

  const handleDeleteData = async () => {
    const confirmed = await confirm({
      confirmText: "I'm sure",
      dismissText: "Cancel",
      title: "Are you sure?",
      description: "Deleting your data is not reversible and it'll be gone forever.\nYou should restart the app after.",
    });

    if (!confirmed) {
      return;
    }

    await deleteDatabase();
  };

  const handleScheduledExportFolder = async () => {
    requestFolderAccess();
  };

  const handleThemeChange = () => {
    setLocalTheme(localTheme === "dark" ? "light" : "dark");
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleShowAllCollectionChange = async () => {
    setLocalShowAllCollection(!localShowAllCollection);
    await updateSettings({ showAllCollection: !localShowAllCollection });
  };

  const handleChangeNCols = async (nCols: number) => {
    await updateSettings({ trackersGridColsNumber: nCols });
  };

  const settingsData: ISection[] = [
    {
      title: <ThemedText type="title">General</ThemedText>,
      data: [
        {
          key: "theme",
          render: (
            <ActionableListItem
              title="Dark mode"
              onPress={handleThemeChange}
              right={<Switch onChange={handleThemeChange} value={localTheme === "dark"} />}
            />
          ),
        },
        {
          key: "show-all-collection",
          render: (
            <ActionableListItem
              title="Show tab for all trackers"
              onPress={handleShowAllCollectionChange}
              right={<Switch onChange={handleShowAllCollectionChange} value={localShowAllCollection} />}
            />
          ),
        },
        {
          key: "tracker-grid-cols",
          render: <ActionableListItem title="Tracker grid" onPress={showTrackerGridSettings} />,
        },
      ],
    },
    {
      title: <ThemedText type="title">Data Management</ThemedText>,
      data: [
        {
          key: "reload-db",
          render: <ActionableListItem title="Reload database" onPress={reloadDb} />,
        },
        {
          key: "export-data",
          render: <ActionableListItem title="Export Data" onPress={showExportDbSheet} />,
        },
        {
          key: "import-data",
          render: <ActionableListItem title="Import Data" onPress={showImportDbSheet} />,
        },
        {
          key: "delete-data",
          render: (
            <ActionableListItem
              title={<ThemedText style={styles.dangerText}>Delete All Data</ThemedText>}
              onPress={handleDeleteData}
            />
          ),
        },
      ],
    },
    {
      title: <ThemedText type="title">Usage</ThemedText>,
      data: [
        {
          key: "collection",
          render: <TextListItem title="Collections" right={<ThemedText>{collectionsCount}</ThemedText>} />,
        },
        {
          key: "trackers",
          render: <TextListItem title="Trackers" right={<ThemedText>{trackersCount}</ThemedText>} />,
        },
        {
          key: "entries",
          render: <TextListItem title="Entries" right={<ThemedText>{entriesCount}</ThemedText>} />,
        },
      ],
    },
    {
      title: <ThemedText type="title">Scheduled Exports</ThemedText>,
      data:
        Platform.OS === "android"
          ? [
              {
                key: "export-folder",
                render: (
                  <ActionableListItem
                    title="Destination folder"
                    subtitle={currentExportFolder?.replace(
                      "content://com.android.externalstorage.documents/tree/primary%3A",
                      "",
                    )}
                    onPress={handleScheduledExportFolder}
                  />
                ),
              },
              {
                key: "export-frequency",
                render: (
                  <ActionableListItem
                    title="Frequency"
                    subtitle={exportFrequency ? `Every ${exportFrequency} days` : "Never"}
                    onPress={showExportFrequencySheet}
                  />
                ),
              },
              {
                key: "export-logs",
                render: <ActionableListItem title="Logs" onPress={handleShowExportLogs} />,
              },
            ]
          : [
              {
                key: "export-unavailable",

                render: (
                  <TextListItem title="Scheduled export is unavailable on iOS. Try setting up an export reminder." />
                ),
              },
            ],
    },
  ];

  return (
    <ThemedView>
      {ConfirmModal}
      <SectionList style={styles.list} sections={settingsData} />
      <TrackerGridSettingsBottomSheet
        ref={trackerGridSettingsSheet}
        initialNCols={settings.trackersGridColsNumber}
        onChangeNCols={handleChangeNCols}
      />
      <ScheduledExportFrequencyBottomSheet
        ref={scheduledExportFrequencySheet}
        onFrequencyChange={handleChangeExportFrequency}
      />
      <BottomSheet
        snapPoints={[EXPORT_DATABASE_BOTTOM_SHEET_HEIGHT]}
        ref={exportDbSheetRef}
        onChange={exportSheetChange}
      >
        <ExportDatabaseBottomSheetView />
      </BottomSheet>
      <BottomSheet
        snapPoints={[IMPORT_DATABASE_BOTTOM_SHEET_HEIGHT]}
        ref={importDbSheetRef}
        onChange={importSheetChange}
      >
        <ImportDatabaseBottomSheet />
      </BottomSheet>
    </ThemedView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    list: {
      paddingHorizontal: Sizes.medium,
    },
    dangerText: {
      color: theme.button.danger.background,
    },
  });

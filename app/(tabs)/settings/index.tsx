import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { Sizes } from "@/constants/Sizes";
import { useCounts } from "@/hooks/data/useCounts";
import { useDeleteDatabase } from "@/hooks/useDeleteDatabase";
import SectionList, { type ISection } from "@/components/SectionList";
import ActionableListItem from "@/components/ActionableListItem";
import TextListItem from "@/components/TextListItem";
import { useEffect, useRef, useState } from "react";
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
import { TrackerGridSettingsBottomSheet } from "@/components/BottomSheets/TrackerGridSettingsBottomSheet";
import { useScheduledExport } from "@/hooks/useScheduledExport";
import { useRouter } from "expo-router";
import { ThemedSwitch } from "@/components/ThemedSwitch";
import { useNotifications } from "@/hooks/useNotifications";
import { useSettings } from "@/contexts/SettingsContext";
import { useColors, type ThemedColors } from "@/contexts/ThemeContext";
import { formatSAFUri } from "@/utils/formatSAFUri";
import { getAllScheduledNotificationsAsync } from "expo-notifications";

export default function SettingsScreen() {
  const { reloadDb } = useDatabase();
  const { collectionsCount, trackersCount, entriesCount } = useCounts();
  const { confirm, ConfirmModal } = useConfirmModal();
  const { deleteDatabase } = useDeleteDatabase();
  const { theme, setTheme } = useColors();
  const { settings, updateSettings } = useSettings();
  const [localTheme, setLocalTheme] = useState(theme);
  const [localShowAllCollection, setLocalShowAllCollection] = useState(settings.showAllCollection);
  const { styles } = useStyles(createStyles);
  const router = useRouter();
  const { ensureNotificationPermission, scheduleExportNotification, scheduleTrackerNotification } = useNotifications();

  const trackerGridSettingsSheet = useRef<BottomSheetModal>(null);
  const exportDbSheetRef = useRef<BottomSheetModal>(null);
  const importDbSheetRef = useRef<BottomSheetModal>(null);
  const { handleSheetPositionChange: exportSheetChange } = useBottomSheetBackHandler(exportDbSheetRef);
  const { handleSheetPositionChange: importSheetChange } = useBottomSheetBackHandler(importDbSheetRef);
  const { currentExportFolder, requestFolderAccess } = useScheduledExport();
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    getAllScheduledNotificationsAsync().then((n) => setNotificationsCount(n.length));
  }, []);

  const showTrackerGridSettings = () => {
    trackerGridSettingsSheet.current?.present();
  };

  const showExportDbSheet = () => {
    exportDbSheetRef.current?.present();
  };

  const showImportDbSheet = () => {
    importDbSheetRef.current?.present();
  };

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
      data: [
        {
          key: "theme",
          render: (
            <ActionableListItem
              title="Dark mode"
              onPress={handleThemeChange}
              right={<ThemedSwitch onChange={handleThemeChange} value={localTheme === "dark"} />}
            />
          ),
        },
        {
          key: "show-all-collection",
          render: (
            <ActionableListItem
              title="Show tab for all trackers"
              onPress={handleShowAllCollectionChange}
              right={<ThemedSwitch onChange={handleShowAllCollectionChange} value={localShowAllCollection} />}
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
      title: <ThemedText type="title">Notifications</ThemedText>,
      data: [
        {
          key: "manage-notifications",
          render: (
            <ActionableListItem
              title="Manage notifications"
              onPress={() => router.navigate("/notifications/manageNotifications")}
            />
          ),
        },
        {
          key: "ensure-notifications",
          render: <ActionableListItem title="Validate permissions" onPress={ensureNotificationPermission} />,
        },
      ],
    },
    {
      title: <ThemedText type="title">Scheduled Exports</ThemedText>,
      data: [
        {
          key: "export-folder",
          render: (
            <ActionableListItem
              title="Destination folder"
              subtitle={formatSAFUri(currentExportFolder ?? undefined, "No folder selected")}
              onPress={handleScheduledExportFolder}
            />
          ),
        },
        {
          key: "setup-export-reminder",
          render: (
            <ActionableListItem
              title="Setup export notification"
              // subtitle={formatSAFUri(currentExportFolder ?? undefined, "No folder selected")}
              // onPress={handleScheduledExportFolder}
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
        {
          key: "notifications-count",
          render: <TextListItem title="Active notifications" right={<ThemedText>{notificationsCount}</ThemedText>} />,
        },
      ],
    },
  ];

  return (
    <ThemedView>
      <BottomSheet
        snapPoints={[IMPORT_DATABASE_BOTTOM_SHEET_HEIGHT]}
        ref={importDbSheetRef}
        onChange={importSheetChange}
      >
        <ImportDatabaseBottomSheet />
      </BottomSheet>
      {ConfirmModal}
      <SectionList style={styles.list} sections={settingsData} />
      <TrackerGridSettingsBottomSheet
        ref={trackerGridSettingsSheet}
        initialNCols={settings.trackersGridColsNumber}
        onChangeNCols={handleChangeNCols}
      />
      <BottomSheet
        snapPoints={[EXPORT_DATABASE_BOTTOM_SHEET_HEIGHT]}
        ref={exportDbSheetRef}
        onChange={exportSheetChange}
      >
        <ExportDatabaseBottomSheetView />
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

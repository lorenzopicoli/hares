import { StyleSheet, Switch } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { Sizes } from "@/constants/Sizes";
import { useCounts } from "@/hooks/data/useCounts";
import { useRestoreDatabase } from "@/hooks/useRestoreDatabase";
import { useExportDatabase } from "@/hooks/useExportDatabase";
import { useDeleteDatabase } from "@/hooks/useDeleteDatabase";
import { useColors } from "@/components/ThemeProvider";
import SectionList, { type ISection } from "@/components/SectionList";
import ActionableListItem from "@/components/ActionableListItem";
import TextListItem from "@/components/TextListItem";
import { useCallback } from "react";

export default function SettingsScreen() {
  const { reloadDb } = useDatabase();
  const { exportDatabaseJSON, exportDatabaseSQLite } = useExportDatabase();
  const { restoreDatabaseSQLite, restoreDatabaseJSON } = useRestoreDatabase();
  const { collectionsCount, trackersCount, entriesCount } = useCounts();
  const { confirm, ConfirmModal } = useConfirmModal();
  const { deleteDatabase } = useDeleteDatabase();
  const { colors, theme, setTheme } = useColors();
  const toggleTheme = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [setTheme, theme]);
  const settingsData: ISection[] = [
    {
      data: [
        {
          key: "theme",
          render: (
            <ActionableListItem
              title="Dark mode"
              onPress={toggleTheme}
              right={<Switch onChange={toggleTheme} value={theme === "dark"} />}
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
          render: <ActionableListItem title="Reload database" onPress={reloadDb} />,
        },
        {
          key: "export-data",
          render: <ActionableListItem title="Export Data" onPress={exportDatabaseJSON} />,
        },
        {
          key: "import-data",
          render: <ActionableListItem title="Import Data" onPress={restoreDatabaseJSON} />,
        },
        {
          key: "delete-data",
          render: (
            <ActionableListItem
              title={<ThemedText style={{ color: colors.button.danger.background }}>Delete All Data</ThemedText>}
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
  ];

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

  const handleExportSQL = async () => {
    await exportDatabaseSQLite("hares-backup");
  };

  const handleSetTheme = (option: "light" | "dark" | null) => {
    if (option) {
      setTheme(option);
    }
  };

  return (
    <>
      {ConfirmModal}
      <SectionList style={styles.list} sections={settingsData} />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Sizes.medium,
  },
});

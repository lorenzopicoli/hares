import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ThemedScrollView from "@/components/ThemedScrollView";
import * as SQLite from "expo-sqlite";
import ThemedButton from "@/components/ThemedButton";
import { useDatabase } from "@/contexts/DatabaseContext";
import { DB_NAME } from "@/db/schema";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { Sizes } from "@/constants/Sizes";
import { useCounts } from "@/hooks/data/useCounts";
import { useBackupDatabaseSQLite, useExportDataAsJson } from "@/hooks/useExportDatabase";
import { useRestoreDatabase } from "@/hooks/useRestoreDatabase";

export default function SettingsScreen() {
  const { db, reloadDb } = useDatabase();
  const { exportData } = useExportDataAsJson();
  const { backupDatabaseSQLite } = useBackupDatabaseSQLite();
  const { restoreDatabaseSQLite } = useRestoreDatabase();
  const { collectionsCount, trackersCount, entriesCount } = useCounts();
  const { confirm, ConfirmModal } = useConfirmModal();

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

    try {
      db.$client.closeSync();
    } catch (err) {
      console.log("Error closing connection, maybe already closed?", err);
    }
    try {
      SQLite.deleteDatabaseSync(DB_NAME);
    } catch (err) {
      console.log("Error deleting DB, maybe doesn't exist?", err);
    }
    await reloadDb();
  };

  const handleExportSQL = async () => {
    await backupDatabaseSQLite("hares-backup");
  };

  const handleExportJSON = async () => {
    await exportData();
  };

  return (
    <ThemedScrollView>
      <ThemedText type="title">Data Management</ThemedText>
      <ThemedView style={styles.section}>
        <ThemedView style={styles.counts}>
          <ThemedView style={styles.countsRow}>
            <ThemedText>Collections:</ThemedText>
            <ThemedText>{collectionsCount}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.countsRow}>
            <ThemedText>Trackers:</ThemedText>
            <ThemedText>{trackersCount}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.countsRow}>
            <ThemedText>Entries:</ThemedText>
            <ThemedText>{entriesCount}</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedButton onPress={handleExportSQL} title="Export data (SQLite)" />
        <ThemedButton onPress={handleExportJSON} title="Export data (JSON)" />
        <ThemedButton onPress={restoreDatabaseSQLite} title="Restore database (SQLite)" />
        <ThemedButton onPress={reloadDb} title="Reload DB connection" />
        <ThemedButton mode="danger" onPress={handleDeleteData} title="Delete all data" />
      </ThemedView>
      {ConfirmModal}
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    flexDirection: "column",
    gap: Sizes.large,
  },
  counts: {
    flexDirection: "column",
    gap: Sizes.small,
  },
  countsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

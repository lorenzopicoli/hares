import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedButton from "@/components/ThemedButton";
import { useDatabase } from "@/contexts/DatabaseContext";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { Sizes } from "@/constants/Sizes";
import { useCounts } from "@/hooks/data/useCounts";
import { useRestoreDatabase } from "@/hooks/useRestoreDatabase";
import { useExportDatabase } from "@/hooks/useExportDatabase";
import { useDeleteDatabase } from "@/hooks/useDeleteDatabase";

export default function SettingsScreen() {
  const { reloadDb } = useDatabase();
  const { exportDatabaseJSON, exportDatabaseSQLite } = useExportDatabase();
  const { restoreDatabaseSQLite, restoreDatabaseJSON } = useRestoreDatabase();
  const { collectionsCount, trackersCount, entriesCount } = useCounts();
  const { confirm, ConfirmModal } = useConfirmModal();
  const { deleteDatabase } = useDeleteDatabase();

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
        <ThemedButton onPress={exportDatabaseJSON} title="Export data (JSON)" />
        <ThemedButton onPress={restoreDatabaseSQLite} title="Restore database (SQLite)" />
        <ThemedButton onPress={restoreDatabaseJSON} title="Restore database (JSON)" />
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

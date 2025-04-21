import { useDatabase, DATABASE_NAME } from "@/contexts/DatabaseContext";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as schema from "@/db/schema";
import { useCallback } from "react";

export const useBackupDatabaseSQLite = () => {
  const { db } = useDatabase();
  const backupDatabaseSQLite = useCallback(
    async (backupName: string) => {
      try {
        await db.$client.execAsync("PRAGMA wal_checkpoint(FULL)");
        const appPath = FileSystem.documentDirectory;
        const dbPath = `${appPath}/SQLite/${DATABASE_NAME}`;
        const backupPath = `${appPath}/SQLite/${backupName.replace(".db", "")}.sqlite`;

        await FileSystem.copyAsync({
          from: dbPath,
          to: backupPath,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(backupPath);
        } else {
          Alert.alert("Sharing not available", "Sharing is not available on this device");
        }
        await FileSystem.deleteAsync(backupPath, { idempotent: true });
      } catch (err) {
        console.error("Failed to backup", err);
        Alert.alert("Export Error", "Failed to export database");
      }
    },
    [db],
  );

  return { backupDatabaseSQLite };
};

export const useExportDataAsJson = () => {
  const { db } = useDatabase();
  const exportData = useCallback(async () => {
    try {
      const allTables = [
        "trackersTable",
        "collectionsTable",
        "collectionsTrackersTable",
        "entriesTable",
        "textListEntriesTable",
      ];
      const data: unknown = {};
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const schemas: any = schema;

      for (const table of allTables) {
        const tableData = await db.select().from(schemas[table]);
        schemas[table] = tableData;
      }

      const jsonString = JSON.stringify(data, null, 2);
      const jsonPath = `${FileSystem.documentDirectory}/hares_data.json`;

      await FileSystem.writeAsStringAsync(jsonPath, jsonString);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(jsonPath);
      } else {
        Alert.alert("Sharing not available", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error exporting JSON data:", error);
      Alert.alert("Export Error", "Failed to export data as JSON");
    }
  }, [db]);
  return { exportData };
};

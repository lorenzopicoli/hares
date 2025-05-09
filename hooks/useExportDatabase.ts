import { useDatabase, DATABASE_NAME } from "@/contexts/DatabaseContext";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as schema from "@/db/schema";
import { useCallback } from "react";
import type { SQLiteDatabase } from "expo-sqlite";

export const exportDatabase = async (backupName: string, db?: SQLiteDatabase) => {
  await db?.execAsync("PRAGMA wal_checkpoint(FULL)");
  const appPath = FileSystem.documentDirectory;
  const dbPath = `${appPath}SQLite/${DATABASE_NAME}`;
  const backupPath = `${appPath}SQLite/${backupName.replace(".db", "")}.sqlite`;

  await FileSystem.copyAsync({
    from: dbPath,
    to: backupPath,
  });

  return backupPath;
};

export const useExportDatabase = () => {
  const { db } = useDatabase();
  const exportDatabaseSQLite = useCallback(
    async (backupName: string) => {
      try {
        const backupPath = await exportDatabase(backupName, db.$client);
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

  const exportDatabaseJSON = useCallback(async () => {
    try {
      const allTables = [
        "trackersTable",
        "collectionsTable",
        "collectionsTrackersTable",
        "entriesTable",
        "textListEntriesTable",
        "settingsTable",
        "exportLogsTable",
      ];
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const data: any = {};
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const schemas: any = schema;

      for (const table of allTables) {
        const tableData = await db.select().from(schemas[table]);
        data[table] = tableData;
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

  return { exportDatabaseJSON, exportDatabaseSQLite };
};

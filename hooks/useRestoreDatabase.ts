import { useDatabase } from "@/contexts/DatabaseContext";
import * as schema from "@/db/schema";
import { useCallback } from "react";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";

export const useRestoreDatabase = () => {
  const { db, reloadDb } = useDatabase();
  const restoreDatabaseSQLite = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) {
        return;
      }
      const backupPath = result.assets[0].uri;
      if (!(await FileSystem.getInfoAsync(backupPath)).exists) {
        return;
      }
      const dbPath = `file://${db.$client.databasePath}`;

      try {
        await db.$client.execAsync("PRAGMA wal_checkpoint(FULL)");

        await db.$client.closeAsync();
      } catch {}
      await FileSystem.deleteAsync(`${dbPath}-wal`, { idempotent: true });
      await FileSystem.deleteAsync(`${dbPath}-shm`, { idempotent: true });

      await FileSystem.copyAsync({
        to: dbPath,
        from: backupPath,
      });
      reloadDb();
    } catch (err) {
      console.error("Failed to restore", err);
      Alert.alert("Restore Error", "Failed to restore database");
    }
  }, [db, reloadDb]);

  const restoreDatabaseJSON = useCallback(async () => {
    try {
      const baseDir = FileSystem.documentDirectory;
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) {
        return;
      }
      const backupPath = result.assets[0].uri;
      if (!(await FileSystem.getInfoAsync(backupPath)).exists) {
        return;
      }
      await FileSystem.copyAsync({
        to: `${baseDir}hares-json-import${new Date().toISOString()}.json`,
        from: backupPath,
      });

      const jsonString = await FileSystem.readAsStringAsync(backupPath);

      const data = JSON.parse(jsonString);
      const tablesInOrder = [
        "trackersTable",
        "collectionsTable",
        "collectionsTrackersTable",
        "entriesTable",
        "textListEntriesTable",
        "settingsTable",
        "exportLogsTable",
      ];

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const schemas: any = schema;
      const dateFields = ["date", "createdAt", "updatedAt", "deletedAt"];

      for (const table of tablesInOrder) {
        await db.delete(schemas[table]);

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const processedData = data[table].map((record: any) => {
          const processedRecord = { ...record };

          for (const field of dateFields) {
            if (field in processedRecord && processedRecord[field] !== null) {
              if (typeof processedRecord[field] === "string" || typeof processedRecord[field] === "number") {
                processedRecord[field] = new Date(processedRecord[field]);
              }
            }
          }

          return processedRecord;
        });

        if (processedData.length > 0) {
          await db.insert(schemas[table]).values(processedData);
        }
      }

      reloadDb();
    } catch (err) {
      console.error("Failed to restore", err);
      Alert.alert("Restore Error", "Failed to restore database");
    }
  }, [db, reloadDb]);

  return {
    restoreDatabaseSQLite,
    restoreDatabaseJSON,
  };
};

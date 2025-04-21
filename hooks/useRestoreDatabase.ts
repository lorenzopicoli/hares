import { useDatabase } from "@/contexts/DatabaseContext";
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
      const dbPath = db.$client.databasePath;
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
      console.log("he");
      reloadDb();
      console.log("af");
    } catch (err) {
      console.error("Failed to restore", err);
      Alert.alert("Restore Error", "Failed to restore database");
    }
  }, [db, reloadDb]);

  return {
    restoreDatabaseSQLite,
  };
};

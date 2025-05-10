import { useDatabase, DATABASE_NAME, DB_FOLDER_KEY } from "@/contexts/DatabaseContext";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as schema from "@/db/schema";
import { useCallback } from "react";
import type { SQLiteDatabase } from "expo-sqlite";
import Storage from "expo-sqlite/kv-store";

export const exportDatabase = async (opts: {
  db?: SQLiteDatabase;
  backupName: string;
  backupFolder?: string;
  extension?: ".db" | ".sqlite";
}) => {
  await opts.db?.execAsync("PRAGMA wal_checkpoint(FULL)");
  const dbFolder = await Storage.getItemAsync(DB_FOLDER_KEY);
  const dbPath = `${dbFolder}/${DATABASE_NAME}`;
  const backupFolder = opts.backupFolder ?? dbFolder;
  const filename =
    opts.extension && opts.extension === ".db"
      ? `${opts.backupName.replace(".db", "")}.db`
      : `${opts.backupName.replace(".db", "")}.sqlite`;
  const backupPath = `${backupFolder}/${filename}`;

  await FileSystem.copyAsync({
    from: dbPath,
    to: backupPath,
  });

  return backupPath;
};

export async function copyDbToFolder(conn: SQLiteDatabase, destinationFolder: string) {
  try {
    const backupName = "hares-backup.db";
    const backupPath = await exportDatabase({ db: conn, backupName, extension: ".db" });

    const destinationPath = `${destinationFolder}/${DATABASE_NAME}`;
    const { exists } = await FileSystem.getInfoAsync(backupPath);
    if (!exists) {
      console.log("Failed to find backup");
      throw new Error("");
    }
    const contentsString = await FileSystem.readAsStringAsync(backupPath, {
      encoding: "base64",
    });

    const destinationFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      destinationFolder,
      DATABASE_NAME,
      "application/x-sqlite3",
    );
    await FileSystem.StorageAccessFramework.writeAsStringAsync(destinationFileUri, contentsString, {
      encoding: "base64",
    });
    console.log("DB copied to", destinationPath);

    await FileSystem.deleteAsync(backupPath, { idempotent: true });

    console.log("Cleaned up local folder");
  } catch (err) {
    console.error("Failed to backup", err);
  }
}

export const useExportDatabase = () => {
  const { db } = useDatabase();
  const exportDatabaseSQLite = useCallback(
    async (backupName: string) => {
      try {
        const backupPath = await exportDatabase({ db: db.$client, backupName });
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

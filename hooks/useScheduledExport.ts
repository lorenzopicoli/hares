import * as SQLite from "expo-sqlite";
import { DATABASE_NAME } from "@/contexts/DatabaseContext";
import * as FileSystem from "expo-file-system";
import { exportDatabase } from "./useExportDatabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const SCHEDULED_EXPORT_STORAGE_KEY = "scheduledExportFolder";

export async function handleBackgroundExport() {
  try {
    const newDbCon = SQLite.openDatabaseSync(DATABASE_NAME, { enableChangeListener: false });

    const destinationFolder = await AsyncStorage.getItem(SCHEDULED_EXPORT_STORAGE_KEY);

    console.log("Destination folder is", destinationFolder);
    if (!destinationFolder) {
      return;
    }

    console.log("DB connection established");
    const backupName = `hares-export-${new Date().toISOString()}`.replaceAll(":", "_").replaceAll(".", "_");
    const backupPath = await exportDatabase(newDbCon, backupName);

    console.log("DB Exported to", backupPath);
    const destinationPath = `${destinationFolder}/${backupName}.sqlite`;
    console.log("Copying DB to folder", destinationPath);
    const { exists } = await FileSystem.getInfoAsync(backupPath);
    console.log("exists", exists);
    const contentsString = await FileSystem.readAsStringAsync(backupPath, {
      encoding: "base64",
    });

    const destinationFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      destinationFolder,
      `${backupName}.sqlite`,
      "application/x-sqlite3",
    );
    await FileSystem.StorageAccessFramework.writeAsStringAsync(destinationFileUri, contentsString, {
      encoding: "base64",
    });
    console.log("DB copied to", destinationPath);

    await FileSystem.deleteAsync(backupPath, { idempotent: true });

    console.log("Cleaned up local folder");
    return destinationFolder;
  } catch (err) {
    console.error("Failed to backup", err);
    alert(`Filed to export your database: ${JSON.stringify(err)}`);
  }
}

export const useScheduledExport = () => {
  const [currentExportFolder, setCurrentExportFolder] = useState<string | null>();

  const init = async () => {
    setCurrentExportFolder(await AsyncStorage.getItem(SCHEDULED_EXPORT_STORAGE_KEY));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    init();
  }, []);

  const requestFolderAccess = useCallback(async () => {
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return false;
    }
    const uri = permissions.directoryUri;

    await AsyncStorage.setItem(SCHEDULED_EXPORT_STORAGE_KEY, uri);
    setCurrentExportFolder(uri);
    return true;
  }, []);

  return {
    currentExportFolder,
    requestFolderAccess,
  };
};

import BackgroundFetch from "react-native-background-fetch";
import * as SQLite from "expo-sqlite";
import { DATABASE_NAME } from "@/contexts/DatabaseContext";
import * as FileSystem from "expo-file-system";
import { exportDatabase } from "./useExportDatabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { exportLogsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const SCHEDULED_EXPORT_STORAGE_KEY = "scheduledExportFolder";
const SCHEDULED_EXPORT_FREQUENCY = "scheduledExportFrequency";
const SCHEDULED_EXPORT_FAILED_LOGS_KEY = "scheduledExportFailedLogs";
const SCHEDULED_EXPORT_TASK_ID = "com.lorenzopicoli.hares.exporttask";

export async function handleBackgroundExport(taskId: string, isTimeout: boolean) {
  console.log("Starting BG task");
  if (isTimeout || taskId !== SCHEDULED_EXPORT_TASK_ID) {
    console.log("Timeout or invalid taskId", taskId);
    // This task has exceeded its allowed running-time.
    BackgroundFetch.finish(taskId);
    return;
  }

  try {
    const newDbCon = SQLite.openDatabaseSync(DATABASE_NAME, { enableChangeListener: false });
    const drizzleDb = drizzle(newDbCon, { schema: { exportLogsTable }, logger: false });

    const logId = await drizzleDb
      .insert(exportLogsTable)
      .values({ createdAt: new Date() })
      .returning({ id: exportLogsTable.id })
      .then((l) => l?.[0]?.id);

    if (!logId) {
      throw new Error("Failed to insert in database");
    }

    const destinationFolder = await AsyncStorage.getItem(SCHEDULED_EXPORT_STORAGE_KEY);

    await drizzleDb.update(exportLogsTable).set({ destinationFolder }).where(eq(exportLogsTable.id, logId));
    console.log("Destination folder is", destinationFolder);
    if (!destinationFolder) {
      BackgroundFetch.finish(taskId);
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
    await drizzleDb.update(exportLogsTable).set({ finishedAt: new Date() }).where(eq(exportLogsTable.id, logId));

    console.log("Cleaned up local folder");
  } catch (err) {
    console.error("Failed to backup", err);
    try {
      const prevFailedLogs = await AsyncStorage.getItem(SCHEDULED_EXPORT_FAILED_LOGS_KEY);
      const failedLogs = JSON.parse(prevFailedLogs ?? "[]");
      await AsyncStorage.setItem(
        SCHEDULED_EXPORT_FAILED_LOGS_KEY,
        JSON.stringify([...failedLogs, { date: new Date().toISOString(), error: String(err) }]),
      );
    } catch (e) {
      console.error("Failed to log error", e);
    }
  }

  BackgroundFetch.finish(taskId);
}

export const useScheduledExport = () => {
  const [currentExportFolder, setCurrentExportFolder] = useState<string | null>();
  const [exportFrequency, setExportFrequency] = useState<number | null>();

  const init = async () => {
    setCurrentExportFolder(await AsyncStorage.getItem(SCHEDULED_EXPORT_STORAGE_KEY));
    setExportFrequency(await AsyncStorage.getItem(SCHEDULED_EXPORT_FREQUENCY).then((v) => (v && +v ? +v : null)));
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
    return uri;
  }, []);

  const stopAllScheduledExports = useCallback(async () => {
    await BackgroundFetch.stop();
    await BackgroundFetch.stop(SCHEDULED_EXPORT_TASK_ID);
  }, []);

  const setupScheduledExport = useCallback(
    async (intervalDays: number) => {
      await stopAllScheduledExports();
      const intervalInMin = intervalDays * 24 * 60 + 15;
      await BackgroundFetch.configure(
        {
          minimumFetchInterval: Math.max(intervalInMin, 15),
          stopOnTerminate: false,
          enableHeadless: true,
          startOnBoot: true,
          // Android options
          forceAlarmManager: false,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
          requiresCharging: false,
          requiresDeviceIdle: false,
          requiresBatteryNotLow: false,
          requiresStorageNotLow: false,
        },
        async (taskId: string) => {
          await handleBackgroundExport(taskId, false);
        },
        async (taskId: string) => {
          await handleBackgroundExport(taskId, true);
        },
      );

      BackgroundFetch.scheduleTask({
        taskId: SCHEDULED_EXPORT_TASK_ID,
        forceAlarmManager: true,
        stopOnTerminate: false,
        startOnBoot: true,
        periodic: true,
        enableHeadless: true,

        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE,
        delay: intervalInMin * 60 * 1000,
      });
    },
    [stopAllScheduledExports],
  );

  const setExportFrequencyFun = useCallback(
    async (frequency: number | null) => {
      await AsyncStorage.setItem(SCHEDULED_EXPORT_FREQUENCY, String(frequency));
      setExportFrequency(frequency);
      if (frequency) {
        setupScheduledExport(frequency);
      } else {
        stopAllScheduledExports();
      }
    },
    [setupScheduledExport, stopAllScheduledExports],
  );

  return {
    setExportFrequency: setExportFrequencyFun,
    exportFrequency,
    currentExportFolder,
    requestFolderAccess,
    setupScheduledExport,
  };
};

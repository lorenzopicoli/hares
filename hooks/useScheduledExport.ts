import * as SQLite from "expo-sqlite";
import { DATABASE_NAME } from "@/contexts/DatabaseContext";
import * as FileSystem from "expo-file-system";
import { exportDatabase } from "./useExportDatabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { getRegisteredTasksAsync } from "expo-task-manager";
const SCHEDULED_EXPORT_STORAGE_KEY = "scheduledExportFolder";
const SCHEDULED_EXPORT_FREQUENCY = "scheduledExportFrequency";
const SCHEDULED_EXPORT_FAILED_LOGS_KEY = "scheduledExportFailedLogs";
const SCHEDULED_EXPORT_TASK_ID = "com.transistorsoft.rnbackgroundfetch.aaaaaaaaaa";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,
  }),
});

async function registerForPushNotificationsAsync() {
  //   if (Platform.OS === "android") {
  //     await Notifications.setNotificationChannelAsync("Export", {
  //       name: "A channel is needed for the permissions prompt to appear",
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: "#FF231F7C",
  //     });
  //   }

  console.log("Bla async", await AsyncStorage.getItem("bla"));
  console.log("Registered", await getRegisteredTasksAsync());

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  //   const isRegistered = await BackgroundTask.isTaskRegisteredAsync("BG_TASK");
  //   if (isRegistered) {
  // await BackgroundTask.unregisterTaskAsync("BG_TASK");
  //   }
  //   await BackgroundTask.registerTaskAsync("BG_TASK");

  // Second, call scheduleNotificationAsync()
  Notifications.scheduleNotificationAsync({
    content: {
      //   data: { bla: "aha" },
      title: "Look at that notification",
      body: "I'm so proud of myself!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
      channelId: "Export",
    },
  });
}

export async function handleBackgroundExport(taskId: string, isTimeout: boolean) {
  console.log("Starting BG task", taskId, isTimeout);
  if (isTimeout || taskId !== SCHEDULED_EXPORT_TASK_ID) {
    console.log("Timeout or invalid taskId", taskId);
    // This task has exceeded its allowed running-time.
    return;
  }

  try {
    const newDbCon = SQLite.openDatabaseSync(DATABASE_NAME, { enableChangeListener: false });
    // const drizzleDb = drizzle(newDbCon, { schema: { exportLogsTable }, logger: false });

    // const logId = await drizzleDb
    //   .insert(exportLogsTable)
    //   .values({ createdAt: new Date() })
    //   .returning({ id: exportLogsTable.id })
    //   .then((l) => l?.[0]?.id);

    // if (!logId) {
    //   throw new Error("Failed to insert in database");
    // }

    const destinationFolder = await AsyncStorage.getItem(SCHEDULED_EXPORT_STORAGE_KEY);

    // await drizzleDb.update(exportLogsTable).set({ destinationFolder }).where(eq(exportLogsTable.id, logId));
    console.log("Destination folder is", destinationFolder);
    if (!destinationFolder) {
      return;
    }

    console.log("DB connection established");
    const backupName = `hares-export-${new Date().toISOString()}`.replaceAll(":", "_").replaceAll(".", "_");
    const backupPath = await exportDatabase(backupName, newDbCon);

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
    // await drizzleDb.update(exportLogsTable).set({ finishedAt: new Date() }).where(eq(exportLogsTable.id, logId));

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
    return true;
  }, []);

  const stopAllScheduledExports = useCallback(async () => {}, []);

  const setupScheduledExport = useCallback(
    async (frequencyInHours: number) => {
      await stopAllScheduledExports();
      registerForPushNotificationsAsync();
    },
    [stopAllScheduledExports],
  );

  const setExportFrequencyFun = useCallback(
    async (frequencyInHours: number | null) => {
      await AsyncStorage.setItem(SCHEDULED_EXPORT_FREQUENCY, String(frequencyInHours));
      setExportFrequency(frequencyInHours);
      if (frequencyInHours) {
        setupScheduledExport(frequencyInHours);
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

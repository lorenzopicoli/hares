import { isDevice } from "expo-device";
import {
  AndroidImportance,
  getAllScheduledNotificationsAsync,
  getPermissionsAsync,
  type NotificationRequest,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
  type NotificationTriggerInput,
} from "expo-notifications";
import { useCallback, useState } from "react";
import { Platform } from "react-native";
import type * as Notifications from "expo-notifications";

export const EXPORT_NOTIFICATION_CHANNEL = "Export Reminders";
export const TRACKER_NOTIFICATION_CHANNEL = "Tracker Reminders";

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const [existingNotifications, setExistingNotifications] = useState<NotificationRequest[]>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);

  const ensureNotificationPermission = useCallback(async () => {
    if (Platform.OS === "android") {
      await setNotificationChannelAsync(TRACKER_NOTIFICATION_CHANNEL, {
        name: "Trigger notification request",
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (!isDevice) {
      alert("Must use physical device for Push Notifications");
      return false;
    }

    const { status: existingStatus } = await getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return false;
    }

    return true;
  }, []);

  const updateExistingNotifications = useCallback(async () => {
    const notifications = await getAllScheduledNotificationsAsync();
    setExistingNotifications(notifications);
  }, []);

  const scheduleTrackerNotification = useCallback(
    async (title: string, body: string, notificationTrigger?: Omit<NotificationTriggerInput, "channelId">) => {
      ensureNotificationPermission();
      const notificationId = await scheduleNotificationAsync({
        content: {
          title,
          body,
        },
        trigger: notificationTrigger ? { ...notificationTrigger, channelId: TRACKER_NOTIFICATION_CHANNEL } : null,
      });
      await updateExistingNotifications();
      return notificationId;
    },
    [updateExistingNotifications, ensureNotificationPermission],
  );

  const scheduleExportNotification = useCallback(
    async (notificationTrigger?: Omit<NotificationTriggerInput, "channelId">) => {
      ensureNotificationPermission();
      const notificationId = await scheduleNotificationAsync({
        content: {
          title: "Click to backup your Hares data",
          body: "",
          data: {
            type: "export",
          },
        },
        trigger: notificationTrigger ? { ...notificationTrigger, channelId: EXPORT_NOTIFICATION_CHANNEL } : null,
      });
      await updateExistingNotifications();
      return notificationId;
    },
    [updateExistingNotifications, ensureNotificationPermission],
  );

  return { ensureNotificationPermission, scheduleTrackerNotification, scheduleExportNotification };
};

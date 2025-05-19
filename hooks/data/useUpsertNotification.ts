import { useDatabase } from "@/contexts/DatabaseContext";
import { notificationsTable, type DatabaseNewNotification, type Tracker } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useCallback } from "react";
import { useNotifications } from "../useNotifications";
import { SchedulableTriggerInputTypes, type NotificationTriggerInput } from "expo-notifications";
import type { SetupNotificationResult } from "@/app/notifications/setupNotification";
import { useClearTrackerNotifications } from "./useClearTrackerNotifications";

const getNotificationTrigger = (data: SetupNotificationResult): Omit<NotificationTriggerInput, "channelId">[] => {
  if (data.daysOfWeek && data.daysOfWeek.length > 0) {
    return data.daysOfWeek?.map((day) => ({
      type: SchedulableTriggerInputTypes.WEEKLY,
      weekday: day,
      minute: data.minute,
      hour: data.hour,
    }));
  }

  if (data.daysOfMonth) {
    return [
      {
        type: SchedulableTriggerInputTypes.MONTHLY,
        day: data.daysOfMonth ?? 0,
        minute: data.minute,
        hour: data.hour,
      },
    ];
  }

  return [
    {
      type: SchedulableTriggerInputTypes.DAILY,
      minute: data.minute,
      hour: data.hour,
    },
  ];
};

export function useUpsertNotification() {
  const { db } = useDatabase();
  const { scheduleTrackerNotification } = useNotifications();
  const { clearTrackerNotifications } = useClearTrackerNotifications();

  const upsertTrackerNotification = useCallback(
    async (data: SetupNotificationResult, tracker: Tracker, existingId?: number) => {
      const schedule = getNotificationTrigger(data);
      const notificationIds: string[] = [];

      clearTrackerNotifications(tracker);

      for (const trigger of schedule) {
        const notificationId = await scheduleTrackerNotification(tracker.name, "Tracker notification", trigger);
        notificationIds.push(notificationId);
      }

      const notification: DatabaseNewNotification = {
        ...data,
        daysOfWeek: data.daysOfWeek?.join(","),
        trackerId: tracker.id,
        deviceNotificationId: notificationIds.join(","),
        isExport: false,
      };

      const { savedNotificationId } = existingId
        ? await db
            .update(notificationsTable)
            .set(notification)
            .where(eq(notificationsTable.id, existingId))
            .then(() => ({
              savedNotificationId: existingId,
            }))
            .catch((err) => {
              console.log("Failed to update notification", err);
              throw err;
            })
        : await db
            .insert(notificationsTable)
            .values(notification)
            .returning({ savedNotificationId: notificationsTable.id })
            .then((values) => values[0])
            .catch((err) => {
              console.log("Failed to save notification", err);
              throw err;
            });

      return savedNotificationId;
    },
    [db, clearTrackerNotifications, scheduleTrackerNotification],
  );

  return { upsertTrackerNotification };
}

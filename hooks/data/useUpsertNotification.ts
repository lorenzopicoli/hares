import { useDatabase } from "@/contexts/DatabaseContext";
import {
  notificationsTable,
  NotificationType,
  type NewNotification,
  type NotificationRecurrence,
  type Tracker,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { useCallback } from "react";
import { useNotifications } from "../useNotifications";
import { format } from "date-fns";
import { getDateTime } from "@/utils/getDateTime";
import { SchedulableTriggerInputTypes, type NotificationTriggerInput } from "expo-notifications";

const getNotificationTrigger = (data: NotificationRecurrence): Omit<NotificationTriggerInput, "channelId">[] => {
  const { min, hour } = getDateTime(data.time) ?? { min: 0, hour: 0 };
  switch (data.type) {
    case NotificationType.EveryDay:
      return [
        {
          type: SchedulableTriggerInputTypes.DAILY,
          minute: min,
          hour: hour,
        },
      ];
    case NotificationType.DaysOfWeek:
      if (!data.daysOfWeek) {
        return [];
      }
      return data.daysOfWeek?.map((day) => ({
        type: SchedulableTriggerInputTypes.WEEKLY,
        weekday: day,
        minute: min,
        hour: hour,
      }));
    case NotificationType.DaysOfMonth:
      return [
        {
          type: SchedulableTriggerInputTypes.MONTHLY,
          day: data.dayOfMonth ?? 0,
          minute: min,
          hour: hour,
        },
      ];
  }
};

export function useUpsertNotification() {
  const { db } = useDatabase();
  const { scheduleTrackerNotification } = useNotifications();

  const upsertTrackerNotification = useCallback(
    async (data: NotificationRecurrence, tracker: Tracker, existingId?: number) => {
      const schedule = getNotificationTrigger(data);
      const notificationIds: string[] = [];
      for (const trigger of schedule) {
        const notificationId = await scheduleTrackerNotification(tracker.name, "Tracker notification", trigger);
        notificationIds.push(notificationId);
      }

      const notification: NewNotification = {
        minute: Number.parseInt(format(data.time, "mm")),
        hour: Number.parseInt(format(data.time, "HH")),
        daysOfWeek: data.daysOfWeek?.join(","),
        daysOfMonth: data.dayOfMonth,
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
    [db, scheduleTrackerNotification],
  );

  return { upsertTrackerNotification };
}

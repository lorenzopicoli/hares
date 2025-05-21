import { useDatabase } from "@/contexts/DatabaseContext";
import { notificationsTable, type Tracker } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cancelScheduledNotificationAsync } from "expo-notifications";
import { useCallback } from "react";

export function useClearTrackerNotifications() {
  const { db } = useDatabase();

  const clearTrackerNotifications = useCallback(
    async (tracker: Tracker) => {
      const previousNotifications = await db
        .select()
        .from(notificationsTable)
        .where(eq(notificationsTable.trackerId, tracker.id));

      // Cancel all scheduled notifications for this tracker
      for (const prev of previousNotifications) {
        const localIds = prev.deviceNotificationId?.split(",") ?? [];
        for (const localId of localIds) {
          await cancelScheduledNotificationAsync(localId);
        }
      }

      // Remove all database notifications before we recreate them
      await db.delete(notificationsTable).where(eq(notificationsTable.trackerId, tracker.id));
    },
    [db],
  );

  return { clearTrackerNotifications };
}

export function useClearExportNotifications() {
  const { db } = useDatabase();

  const clearExportNotifications = useCallback(async () => {
    const previousNotifications = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.isExport, true));

    // Cancel all scheduled notifications for this tracker
    for (const prev of previousNotifications) {
      const localIds = prev.deviceNotificationId?.split(",") ?? [];
      for (const localId of localIds) {
        await cancelScheduledNotificationAsync(localId);
      }
    }

    // Remove all database notifications before we recreate them
    await db.delete(notificationsTable).where(eq(notificationsTable.isExport, true));
  }, [db]);

  return { clearExportNotifications };
}

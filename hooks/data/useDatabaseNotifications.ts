import { useDatabase } from "@/contexts/DatabaseContext";
import { notificationsTable } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useDatabaseNotifications(params: { isExport?: boolean; trackerId?: number }) {
  const { db } = useDatabase();
  const { isExport, trackerId } = params;

  const { data: notifications } = useLiveQuery(
    db.query.notificationsTable.findMany({
      where: sql`
      ${notificationsTable.isExport} = ${isExport ?? false} AND
      ${trackerId ? eq(notificationsTable.trackerId, trackerId) : sql`1 = 1`}
      `,
      orderBy: desc(notificationsTable.createdAt),
      with: {
        tracker: true,
      },
    }),
    [trackerId, isExport],
  );

  return { notifications };
}

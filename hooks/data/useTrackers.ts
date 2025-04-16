import { useDatabase } from "@/contexts/DatabaseContext";
import { collectionsTrackersTable, trackersTable } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq, getTableColumns, isNotNull, sql } from "drizzle-orm";

export function useTrackers(collectionId?: number) {
  const { db } = useDatabase();
  const { data: trackers } = useLiveQuery(
    db
      .select(getTableColumns(trackersTable))
      .from(trackersTable)
      .leftJoin(collectionsTrackersTable, eq(collectionsTrackersTable.trackerId, trackersTable.id))
      .where(collectionId ? isNotNull(collectionsTrackersTable.id) : sql`1 = 1`)
      .orderBy(collectionsTrackersTable.index, trackersTable.index)
      .groupBy(trackersTable.id),
    [collectionId],
  );

  return { trackers };
}

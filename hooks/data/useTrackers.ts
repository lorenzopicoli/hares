import { useDatabase } from "@/contexts/DatabaseContext";
import { collectionsTrackersTable, trackersTable } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq, getTableColumns, isNotNull, sql } from "drizzle-orm";

export function useTrackers(params: { collectionId?: number; searchQuery?: string }) {
  const { collectionId, searchQuery } = params;
  const { db } = useDatabase();
  const { data: trackers } = useLiveQuery(
    db
      .select(getTableColumns(trackersTable))
      .from(trackersTable)
      .leftJoin(collectionsTrackersTable, eq(collectionsTrackersTable.trackerId, trackersTable.id))
      .where(sql`
        ${searchQuery === "" && collectionId ? isNotNull(collectionsTrackersTable.id) : "1 = 1"} AND
        ${trackersTable.name} LIKE ${`%${searchQuery}%`}
      `)
      .orderBy(collectionsTrackersTable.index, trackersTable.index)
      .groupBy(trackersTable.id),
    [collectionId, searchQuery],
  );

  return { trackers };
}

import { useDatabase } from "@/contexts/DatabaseContext";
import { collectionsTrackersTable, trackersTable } from "@/db/schema";
import { notExists, eq, getTableColumns, isNotNull, sql, and, isNull } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useTrackers(params: { collectionId?: number; searchQuery?: string }) {
  const { collectionId, searchQuery } = params;
  const { db } = useDatabase();
  const { data: trackers, error } = useLiveQuery(
    db
      .select({
        ...getTableColumns(trackersTable),
        // isInCollection: sql`MAX(${collectionsTrackersTable.collectionId}) IS NOT NULL`,
      })
      .from(trackersTable)
      .leftJoin(collectionsTrackersTable, eq(collectionsTrackersTable.trackerId, trackersTable.id))
      .where(sql`
        ${searchQuery === "" && collectionId ? isNotNull(collectionsTrackersTable.id) : "1 = 1"} AND
        ${trackersTable.deletedAt} IS NULL AND
        ${trackersTable.name} LIKE ${`%${searchQuery}%`}
      `)
      .orderBy(collectionId ? collectionsTrackersTable.index : trackersTable.index)
      .groupBy(trackersTable.id),
    [collectionId, searchQuery],
  );

  return { trackers };
}

export function useTrackersNotInCollection(params: { collectionId: number; searchQuery?: string }) {
  const { collectionId, searchQuery } = params;
  const { db } = useDatabase();
  const { data: trackers } = useLiveQuery(
    db
      .select()
      .from(trackersTable)
      .where(
        and(
          notExists(
            db
              .select()
              .from(collectionsTrackersTable)
              .where(sql`${collectionsTrackersTable.collectionId} = ${collectionId} AND
            ${collectionsTrackersTable.trackerId} = ${trackersTable.id}`),
          ),
          isNull(trackersTable.deletedAt),
        ),
      )
      .orderBy(trackersTable.index),
    [collectionId, searchQuery],
  );

  return { trackers };
}

import { useDatabase } from "@/contexts/DatabaseContext";
import { collectionsTrackersTable, trackersTable } from "@/db/schema";
import { getTableColumns, isNotNull, sql, isNull } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useCallback } from "react";

export function useTrackers(params: { collectionId?: number; searchQuery?: string }) {
  const { collectionId, searchQuery = "" } = params;
  const { db } = useDatabase();
  const { data: trackers } = useLiveQuery(
    db
      .select(getTableColumns(trackersTable))
      .from(trackersTable)
      .leftJoin(
        collectionsTrackersTable,
        sql`
            ${collectionsTrackersTable.trackerId} = ${trackersTable.id} AND
            ${collectionId ? sql`${collectionsTrackersTable.collectionId} = ${collectionId}` : sql`1=1`}
        `,
      )
      .where(sql`
        ${searchQuery === "" && collectionId ? isNotNull(collectionsTrackersTable.id) : sql`1 = 1`} AND
        ${trackersTable.deletedAt} IS NULL AND
        ${trackersTable.name} LIKE ${`%${searchQuery}%`}
      `)
      .orderBy(collectionId ? collectionsTrackersTable.index : trackersTable.index)
      .groupBy(trackersTable.id),
    [collectionId, searchQuery],
  );

  return { trackers };
}

export function useTrackersForAddCollection() {
  const { db } = useDatabase();
  const fetchTrackersForAddCollection = useCallback(
    (collectionId?: number) => {
      return db
        .select({
          tracker: getTableColumns(trackersTable),
          isInCollection: isNotNull(collectionsTrackersTable.id).mapWith(Boolean),
        })
        .from(trackersTable)
        .leftJoin(
          collectionsTrackersTable,
          sql`
            ${collectionsTrackersTable.trackerId} = ${trackersTable.id} AND
            ${collectionId ? sql`${collectionsTrackersTable.collectionId} = ${collectionId}` : sql`1=0`}
        `,
        )
        .orderBy(isNull(collectionsTrackersTable.id), collectionsTrackersTable.index, trackersTable.index);
    },
    [db],
  );

  const fetchAllTrackers = useCallback(() => {
    return db
      .select({
        tracker: getTableColumns(trackersTable),
        isInCollection: sql`1=1`.mapWith(Boolean),
      })
      .from(trackersTable)
      .orderBy(trackersTable.index);
  }, [db]);

  return { fetchTrackersForAddCollection, fetchAllTrackers };
}

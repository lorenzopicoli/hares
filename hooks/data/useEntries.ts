import { useDatabase } from "@/contexts/DatabaseContext";
import {
  collectionsTable,
  collectionsTrackersTable,
  entriesTable,
  textListEntriesTable,
  trackersTable,
} from "@/db/schema";
import { eq, desc, sql, inArray } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

export function useEntries(params: { searchText?: string; trackerId?: number; limit?: number }) {
  const { db } = useDatabase();
  const { searchText, trackerId, limit } = params;
  const subQuery = useMemo(
    () =>
      db
        .select({
          id: entriesTable.id,
        })
        .from(entriesTable)
        .where(
          sql`
            ${
              searchText
                ? sql`(${textListEntriesTable.name} LIKE ${`%${searchText}%`} OR 
                        ${collectionsTable.name} LIKE ${`%${searchText}%`} OR 
                        ${trackersTable.name} LIKE ${`%${searchText}%`})`
                : sql`1=1`
            } AND
            ${trackerId ? sql`${entriesTable.trackerId} = ${trackerId}` : sql`1=1`}
        `,
        )
        .leftJoin(textListEntriesTable, eq(textListEntriesTable.entryId, entriesTable.id))
        .leftJoin(trackersTable, eq(trackersTable.id, entriesTable.trackerId))
        .leftJoin(collectionsTrackersTable, eq(collectionsTrackersTable.trackerId, trackersTable.id))
        .leftJoin(collectionsTable, eq(collectionsTable.id, collectionsTrackersTable.collectionId))
        // Properly limit and paginate
        .limit(limit ?? 10000000)
        .orderBy(desc(entriesTable.date))
        .groupBy(entriesTable.id),
    [db, searchText, limit, trackerId],
  );

  const { data: entries } = useLiveQuery(
    db.query.entriesTable.findMany({
      where: inArray(entriesTable.id, subQuery),
      orderBy: desc(entriesTable.date),
      with: {
        textListValues: true,
        tracker: true,
      },
    }),
    [subQuery],
  );

  return { entries };
}

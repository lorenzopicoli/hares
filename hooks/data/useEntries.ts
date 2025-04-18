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

export function useEntries(searchText?: string) {
  const { db } = useDatabase();
  const { data: entryIdsDb, error } = useLiveQuery(
    db
      .select({
        id: entriesTable.id,
      })
      .from(entriesTable)
      .where(
        searchText
          ? sql`
            ${textListEntriesTable.name} LIKE ${`%${searchText}%`} OR 
            ${collectionsTable.name} LIKE ${`%${searchText}%`} OR 
            ${trackersTable.name} LIKE ${`%${searchText}%`}
        `
          : sql`1=1`,
      )
      .leftJoin(textListEntriesTable, eq(textListEntriesTable.entryId, entriesTable.id))
      .leftJoin(trackersTable, eq(trackersTable.id, entriesTable.trackerId))
      .leftJoin(collectionsTrackersTable, eq(collectionsTrackersTable.trackerId, trackersTable.id))
      .leftJoin(collectionsTable, eq(collectionsTable.id, collectionsTrackersTable.collectionId))
      .groupBy(entriesTable.id),
    [searchText],
  );
  const entryIds = useMemo(() => entryIdsDb.map((e) => e.id), [entryIdsDb]);
  const { data: entries, error: error2 } = useLiveQuery(
    db.query.entriesTable.findMany({
      where: inArray(entriesTable.id, entryIds),
      orderBy: desc(entriesTable.date),
      with: {
        textListValues: true,
        tracker: true,
      },
    }),
    [entryIds],
  );

  if (error || error2) {
    console.log(error, error2);
  }

  return { entries };
}

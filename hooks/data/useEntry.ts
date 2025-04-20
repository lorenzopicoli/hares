import { useDatabase } from "@/contexts/DatabaseContext";
import { entriesTable, type TrackerEntry } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq, sql } from "drizzle-orm";
import { useCallback } from "react";

export function useEntry(entryId: number): { entry: TrackerEntry | undefined } {
  const { db } = useDatabase();

  const { data: entry } = useLiveQuery(db.select().from(entriesTable).where(sql`${entriesTable.id} = ${entryId}`), [
    entryId,
  ]);

  return { entry: entry[0] };
}

export function useLazyEntry() {
  const { db } = useDatabase();

  const fetchEntry = useCallback(
    async (entryId: number): Promise<TrackerEntry | undefined> => {
      const entry = await db.query.entriesTable.findFirst({
        where: eq(entriesTable.id, entryId),
        with: {
          textListValues: true,
        },
      });
      return entry;
    },
    [db],
  );

  return { fetchEntry };
}

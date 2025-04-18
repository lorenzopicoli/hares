import { useDatabase } from "@/contexts/DatabaseContext";
import { textListEntriesTable } from "@/db/schema";
import { sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useEntryTextList(params: { trackerId: number; searchQuery?: string }) {
  const { db } = useDatabase();
  const { trackerId, searchQuery } = params;
  const { data: textListEntries } = useLiveQuery(
    db
      .select()
      .from(textListEntriesTable)
      .where(sql`
          ${textListEntriesTable.trackerId} = ${+trackerId} AND
          ${textListEntriesTable.name} LIKE ${`%${searchQuery}%`}
          `)
      .groupBy(textListEntriesTable.name),
    [searchQuery, +trackerId],
  );

  return { textListEntries };
}

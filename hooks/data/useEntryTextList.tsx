import { useDatabase } from "@/contexts/DatabaseContext";
import { entriesTable, textListEntriesTable } from "@/db/schema";
import { sql, eq, desc, getTableColumns } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useEntryTextList(params: { trackerId: number; searchQuery?: string }) {
  const { db } = useDatabase();
  const { trackerId, searchQuery } = params;
  const { data: textListEntries } = useLiveQuery(
    db
      .select(getTableColumns(textListEntriesTable))
      .from(textListEntriesTable)
      .where(sql`
          ${textListEntriesTable.trackerId} = ${+trackerId} AND
          ${textListEntriesTable.name} LIKE ${`%${searchQuery}%`}
          `)
      .leftJoin(entriesTable, eq(textListEntriesTable.entryId, entriesTable.id))
      .groupBy(textListEntriesTable.name)
      .orderBy(desc(sql`MAX(${entriesTable.createdAt})`)),
    [searchQuery, +trackerId],
  );

  return { textListEntries };
}

import { useDatabase } from "@/contexts/DatabaseContext";
import { entriesTable, textListEntriesTable, type NewTextListEntry, type NewTrackerEntry } from "@/db/schema";
import { useCallback } from "react";

export function useCreateEntry() {
  const { db } = useDatabase();

  const createEntry = useCallback(
    async (data: NewTrackerEntry, textListValues?: string[]) => {
      const savedEntry = await db.insert(entriesTable).values(data).returning({ id: entriesTable.id });

      if (textListValues && textListValues.length > 0) {
        const textListEntries: NewTextListEntry[] = textListValues.map((value) => ({
          trackerId: data.trackerId,
          entryId: savedEntry[0].id,
          name: value,
        }));
        await db.insert(textListEntriesTable).values(textListEntries);
      }

      return savedEntry[0];
    },
    [db],
  );

  return { createEntry };
}

import { useDatabase } from "@/contexts/DatabaseContext";
import { entriesTable, textListEntriesTable, type NewTextListEntry, type NewTrackerEntry } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useCallback } from "react";

export function useUpsertEntry() {
  const { db } = useDatabase();

  const upsertEntry = useCallback(
    async (params: { data: NewTrackerEntry; textListValues?: string[]; existingId?: number }) => {
      const { data, textListValues, existingId } = params;

      const { savedEntryId } = existingId
        ? await db
            .update(entriesTable)
            .set(data)
            .where(eq(entriesTable.id, existingId))
            .then(() => ({
              savedEntryId: existingId,
            }))
            .catch((err) => {
              console.log("Failed to update collection", err);
              throw err;
            })
        : await db
            .insert(entriesTable)
            .values(data)
            .returning({ savedEntryId: entriesTable.id })
            .then((values) => values[0])
            .catch((err) => {
              console.log("Failed to save collection", err);
              throw err;
            });

      if (existingId) {
        // Easier than finding the diff
        await db.delete(textListEntriesTable).where(eq(textListEntriesTable.entryId, existingId));
      }

      if (textListValues && textListValues.length > 0) {
        const textListEntries: NewTextListEntry[] = textListValues.map((value) => ({
          trackerId: data.trackerId,
          entryId: savedEntryId,
          name: value,
        }));
        await db.insert(textListEntriesTable).values(textListEntries);
      }

      return savedEntryId;
    },
    [db],
  );

  return { upsertEntry };
}

import { useDatabase } from "@/contexts/DatabaseContext";
import { entriesTable, textListEntriesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useCallback } from "react";

export function useDeleteEntry() {
  const { db } = useDatabase();

  const deleteEntry = useCallback(
    async (entryId: number) => {
      await db.delete(textListEntriesTable).where(eq(textListEntriesTable.entryId, entryId));
      await db.delete(entriesTable).where(eq(entriesTable.id, entryId));
    },
    [db],
  );

  return { deleteEntry };
}

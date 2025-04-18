import { useDatabase } from "@/contexts/DatabaseContext";
import { trackersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useCallback } from "react";

export function useDeleteTracker() {
  const { db } = useDatabase();

  const deleteTracker = useCallback(
    async (trackerId: number) => {
      await db
        .update(trackersTable)
        .set({
          deletedAt: new Date(),
        })
        .where(eq(trackersTable.id, trackerId));
    },
    [db],
  );

  return { deleteTracker };
}

import { useDatabase } from "@/contexts/DatabaseContext";
import { trackersTable, type NewTracker } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useCallback } from "react";

export function useUpsertTracker() {
  const { db } = useDatabase();

  const upsertTracker = useCallback(
    async (data: Omit<NewTracker, "index">, existingId?: number) => {
      const [index] = existingId
        ? []
        : await db
            .select({
              index: trackersTable.index,
            })
            .from(trackersTable)
            .orderBy(trackersTable.index)
            .limit(1);

      const tracker: NewTracker = {
        ...data,
        index: (index?.index ?? 0) + 1,
      };

      const { savedTrackerId } = existingId
        ? await db
            .update(trackersTable)
            .set({ ...tracker, index: undefined })
            .where(eq(trackersTable.id, existingId))
            .then(() => ({
              savedTrackerId: existingId,
            }))
            .catch((err) => {
              console.log("Failed to update tracker", err);
              throw err;
            })
        : await db
            .insert(trackersTable)
            .values(tracker)
            .returning({ savedTrackerId: trackersTable.id })
            .then((values) => values[0])
            .catch((err) => {
              console.log("Failed to save tracker", err);
              throw err;
            });

      return savedTrackerId;
    },
    [db],
  );

  return { upsertTracker };
}

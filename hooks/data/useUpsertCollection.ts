import { useDatabase } from "@/contexts/DatabaseContext";
import { collectionsTable, collectionsTrackersTable, type NewCollection, type NewCollectionTracker } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { useCallback } from "react";

export function useUpsertCollection() {
  const { db } = useDatabase();
  const { reloadDb } = useDatabase();

  const upsertCollection = useCallback(
    async (
      newCollectionParam: Omit<NewCollection, "index">,
      trackers: Omit<NewCollectionTracker, "collectionId">[],
      existingId?: number,
    ) => {
      const [nextIndex] = existingId
        ? []
        : await db
            .select({
              index: collectionsTable.index,
            })
            .from(collectionsTable)
            .orderBy(desc(collectionsTable.index))
            .limit(1);

      const newCollection = { ...newCollectionParam, index: (nextIndex?.index ?? 0) + 1 };

      const { savedCollectionId } = existingId
        ? await db
            .update(collectionsTable)
            .set({
              ...newCollection,
              // do not set index to not change it on edit
              index: undefined,
            })
            .where(eq(collectionsTable.id, existingId))
            .then(() => ({
              savedCollectionId: existingId,
            }))
            .catch((err) => {
              console.log("Failed to update collection", err);
              throw err;
            })
        : await db
            .insert(collectionsTable)
            .values(newCollection)
            .returning({ savedCollectionId: collectionsTable.id })
            .then((values) => values[0])
            .catch((err) => {
              console.log("Failed to save collection", err);
              throw err;
            });

      if (existingId) {
        // Easier than finding the diff
        await db.delete(collectionsTrackersTable).where(eq(collectionsTrackersTable.collectionId, existingId));
      }

      const relationship: NewCollectionTracker[] = trackers.map((t) => ({
        ...t,
        collectionId: savedCollectionId,
      }));

      await db
        .insert(collectionsTrackersTable)
        .values(relationship)
        // Shouldn't happen, but it looks nice
        .onConflictDoUpdate({
          target: [collectionsTrackersTable.trackerId, collectionsTrackersTable.collectionId],
          set: { index: sql.raw('"excluded"."index"') },
        });
      // Because drizzle live queries don't recognize relationship changes, reload the whole
      // db so the track screen shows the updated trackers. Not a very nice solution
      // Also means that the user gets redirected to the "All" collection which is not ideal
      await reloadDb();
      return savedCollectionId;
    },
    [db],
  );

  return { upsertCollection };
}

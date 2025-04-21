import { useDatabase } from "@/contexts/DatabaseContext";
import { collectionsTable, collectionsTrackersTable, type NewCollection, type NewCollectionTracker } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { useCallback } from "react";

export function useUpsertCollection() {
  const { db } = useDatabase();

  const upsertCollection = useCallback(
    async (
      newCollectionParam: Omit<NewCollection, "index">,
      trackers: Omit<NewCollectionTracker, "collectionId">[],
      existingId?: number,
    ) => {
      const nextIndex = await db
        .select({
          index: collectionsTable.index,
        })
        .from(collectionsTable)
        .orderBy(desc(collectionsTable.index))
        .limit(1);

      const newCollection = { ...newCollectionParam, index: (nextIndex?.[0]?.index ?? 0) + 1 };

      const { savedCollectionId } = existingId
        ? await db
            .update(collectionsTable)
            .set(newCollection)
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

      return savedCollectionId;
    },
    [db],
  );

  return { upsertCollection };
}

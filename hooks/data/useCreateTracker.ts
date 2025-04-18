import { useDatabase } from "@/contexts/DatabaseContext";
import { trackersTable, type NewTracker } from "@/db/schema";
import { useCallback } from "react";

export function useCreateTracker() {
  const { db } = useDatabase();

  const createTracker = useCallback(
    async (data: Omit<NewTracker, "index">) => {
      const nextIndex = await db
        .select({
          index: trackersTable.index,
        })
        .from(trackersTable)
        .orderBy(trackersTable.index)
        .limit(1);

      const tracker: NewTracker = {
        ...data,
        index: (nextIndex?.[0]?.index ?? 0) + 1,
      };
      await db.insert(trackersTable).values(tracker);
    },
    [db],
  );

  return { createTracker };
}

import { useDatabase } from "@/contexts/DatabaseContext";
import { trackersTable, type Tracker } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { sql } from "drizzle-orm";
import { useCallback } from "react";

export function useTracker(trackerId: number): { tracker: Tracker | undefined } {
  const { db } = useDatabase();

  const { data: tracker } = useLiveQuery(
    db.select().from(trackersTable).where(sql`${trackersTable.id} = ${trackerId}`),
    [trackerId],
  );

  return { tracker: tracker[0] };
}

export function useLazyTracker() {
  const { db } = useDatabase();

  const fetchTracker = useCallback(
    async (trackerId: number) => {
      const [tracker] = await db.select().from(trackersTable).where(sql`${trackersTable.id} = ${trackerId}`);

      if (!tracker) {
        return { tracker: undefined };
      }

      return { tracker };
    },
    [db],
  );

  return { fetchTracker };
}

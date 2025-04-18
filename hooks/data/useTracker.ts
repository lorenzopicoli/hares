import { useDatabase } from "@/contexts/DatabaseContext";
import { trackersTable, type Tracker } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { sql } from "drizzle-orm";

export function useTracker(trackerId: number): { tracker: Tracker | undefined } {
  const { db } = useDatabase();

  const { data: tracker } = useLiveQuery(
    db.select().from(trackersTable).where(sql`${trackersTable.id} = ${trackerId}`),
    [trackerId],
  );

  return { tracker: tracker[0] };
}

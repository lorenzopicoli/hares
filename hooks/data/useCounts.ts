import { useDatabase } from "@/contexts/DatabaseContext";
import { collectionsTable, entriesTable, trackersTable } from "@/db/schema";
import { count } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useCounts() {
  const { db } = useDatabase();
  const { data: collectionsCount } = useLiveQuery(db.select({ count: count() }).from(collectionsTable));
  const { data: trackersCount } = useLiveQuery(db.select({ count: count() }).from(trackersTable));
  const { data: entriesCount } = useLiveQuery(db.select({ count: count() }).from(entriesTable));

  return {
    collectionsCount: collectionsCount[0]?.count,
    trackersCount: trackersCount[0]?.count,
    entriesCount: entriesCount[0]?.count,
  };
}

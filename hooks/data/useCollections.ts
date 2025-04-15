import { useDatabase } from "@/contexts/DatabaseContext";
import { collectionsTable } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

export function useCollections() {
  const { db } = useDatabase();
  const { data: collections } = useLiveQuery(db.select().from(collectionsTable).orderBy(collectionsTable.index));

  const collectionsWithAll = useMemo(() => [{ id: -1, name: "All" }, ...collections], [collections]);

  return { collectionsWithAll, collections };
}

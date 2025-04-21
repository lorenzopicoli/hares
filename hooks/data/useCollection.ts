import { useDatabase } from "@/contexts/DatabaseContext";
import { collectionsTable, type Collection } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { sql } from "drizzle-orm";
import { useCallback } from "react";

export function useCollection(collectionId: number): { collection: Collection | undefined } {
  const { db } = useDatabase();

  const { data: collection } = useLiveQuery(
    db.select().from(collectionsTable).where(sql`${collectionsTable.id} = ${collectionId}`),
    [collectionId],
  );

  return { collection: collection[0] };
}

export function useLazyCollection() {
  const { db } = useDatabase();

  const fetchCollection = useCallback(
    async (collectionId: number): Promise<Collection | undefined> => {
      const [collection] = await db
        .select()
        .from(collectionsTable)
        .where(sql`${collectionsTable.id} = ${collectionId}`);
      return collection;
    },
    [db],
  );

  return { fetchCollection };
}

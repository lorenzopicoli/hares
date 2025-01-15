import { useCallback, useEffect, useState } from "react";
import { useDB } from "./DBContext";
import type { Entry, EntryDoc } from "./models";
import { v4 } from "uuid";
import { useDeviceId } from "./useDeviceId";
import { useWatchChanges } from "./WatchChangesContext";

interface UseEntriesProps {
  pageSize?: number;
  currentPage?: number;
  keepOldPages?: boolean;
}

export function useEntries({ pageSize = 10, currentPage = 0, keepOldPages = true }: UseEntriesProps = {}) {
  const { db } = useDB();
  const [allEntries, setAllEntries] = useState<EntryDoc[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const refetch = useCallback(async () => {
    const result = await db.find({
      selector: {
        type: "trackerEntry",
        date: { $gt: null },
      },
      sort: [{ date: "desc" }],
      limit: pageSize + 1,
      skip: currentPage * pageSize,
    });

    setHasMore(result.docs.length > pageSize);
    const docs = result.docs.slice(0, result.docs.length - 1) as EntryDoc[];
    setAllEntries(keepOldPages ? [...allEntries, ...docs] : docs);
  }, [db, pageSize, currentPage, keepOldPages]);

  useWatchChanges(refetch);
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    allEntries,
    hasMore,
  };
}

export function useAddEntries() {
  const { db } = useDB();
  const { deviceId } = useDeviceId();

  const addEntries = useCallback(
    async (entries: Entry[]) => {
      const docs: EntryDoc[] = entries.map((entry) => ({
        ...entry,
        _id: v4(),
        type: "trackerEntry",
        deviceId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));

      await db.bulkDocs(docs);
    },
    [db, deviceId],
  );

  return { addEntries };
}

export function useRemoveEntry() {
  const { db } = useDB();

  const removeEntry = useCallback(
    async (entryId: string) => {
      const entryDoc = await db.get(entryId);
      await db.remove(entryDoc);
    },
    [db],
  );

  return { removeEntry };
}

export function updateEntry() {
  const { db } = useDB();

  const updateEntry = useCallback(
    async (entryId: string, data: Partial<Entry>) => {
      const entry = (await db.get(entryId)) as EntryDoc;

      await db.put({
        ...entry,
        ...data,
        updatedAt: new Date(),
      });
    },
    [db],
  );

  return updateEntry;
}

import { useCallback, useEffect, useState } from "react";
import { useDB } from "./DBContext";
import type { Entry, EntryDoc } from "./models";
import { v4 } from "uuid";
import { useDeviceId } from "./useDeviceId";
import { useWatchChanges } from "./WatchChangesContext";

export function useEntries() {
  const { db } = useDB();
  const [allEntries, setAllEntries] = useState<EntryDoc[]>([]);

  const refetch = useCallback(() => {
    db.find({
      selector: {
        type: "trackerEntry",
        createdAt: { $gt: null },
      },
    }).then((result) => setAllEntries(result.docs as EntryDoc[]));
  }, [db]);

  useWatchChanges(refetch);
  useEffect(refetch, []);

  return {
    allEntries,
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

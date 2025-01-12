import { useCallback, useEffect, useMemo, useState } from "react";
import { useDB } from "./DBContext";
import type { Collection, CollectionDoc, TrackerDoc } from "./models";
import { v4 } from "uuid";
import { useDeviceId } from "./useDeviceId";
import { useWatchChanges } from "./WatchChangesContext";

export function useCollections() {
  const { db } = useDB();
  const [allCollections, setAllCollections] = useState<CollectionDoc[]>([]);

  const pinnedCollections = useMemo(() => {
    return allCollections.filter((collection) => !!collection.isPinned);
  }, [allCollections]);

  const refetch = useCallback(() => {
    db.find({
      selector: {
        type: "collection",
        createdAt: { $gt: null },
      },
    }).then((result) => setAllCollections(result.docs as CollectionDoc[]));
  }, [db]);

  useWatchChanges(refetch);
  useEffect(refetch, []);

  return {
    allCollections,
    pinnedCollections,
  };
}

export function useCollectionTrackers(collection: CollectionDoc) {
  const { db } = useDB();
  const [collectionTrackers, setCollectionTrackers] = useState<TrackerDoc[]>([]);
  const refetch = useCallback(() => {
    db.find({
      selector: {
        type: "tracker",
        _id: { $in: collection.trackers },
      },
    }).then((result) => setCollectionTrackers(result.docs as TrackerDoc[]));
  }, [db, collection]);

  //   useWatchChanges(refetch);
  useEffect(refetch, []);

  return {
    collectionTrackers,
  };
}

export function useAddCollection() {
  const { db } = useDB();
  const { deviceId } = useDeviceId();

  const addCollection = useCallback(
    async (collection: Collection) => {
      const doc: CollectionDoc = {
        ...collection,
        _id: v4(),
        type: "collection",
        deviceId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await db.put(doc);
    },
    [db, deviceId],
  );

  return { addCollection };
}

export function useRemoveCollection() {
  const { db } = useDB();

  const removeCollection = useCallback(
    async (collectionId: string) => {
      const collectionDoc = await db.get(collectionId);
      await db.remove(collectionDoc);
    },
    [db],
  );

  return { removeCollection };
}

export function useUpdateCollection() {
  const { db } = useDB();

  const updateCollection = useCallback(
    async (collectionId: string, data: Partial<Collection>) => {
      const collection = (await db.get(collectionId)) as CollectionDoc;

      await db.put({
        ...collection,
        ...data,
        updatedAt: new Date(),
      });
    },
    [db],
  );

  return { updateCollection };
}

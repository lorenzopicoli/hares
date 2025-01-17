import { useCallback, useEffect, useState } from "react";
import { useDB } from "./DBContext";
import type { Tracker, TrackerDoc } from "./models";
import { v4 } from "uuid";
import { useDeviceId } from "./useDeviceId";
import { useWatchChanges } from "./WatchChangesContext";

export function useTrackers() {
  const { db } = useDB();
  const [allTrackers, setAllTrackers] = useState<TrackerDoc[]>([]);

  const refetch = useCallback(() => {
    db.find({
      selector: {
        type: "tracker",
        createdAt: { $gt: null },
        order: { $gt: null },
      },
      sort: ["order"],
      limit: 200,
    }).then((result) => {
      setAllTrackers(result.docs as TrackerDoc[]);
    });
  }, [db]);

  useWatchChanges(refetch);

  useEffect(refetch, []);

  return {
    allTrackers,
  };
}

export function useAddTracker() {
  const { db } = useDB();
  const { deviceId } = useDeviceId();

  const addTracker = useCallback(
    async (tracker: Tracker) => {
      const doc: TrackerDoc = {
        ...tracker,
        _id: v4(),
        type: "tracker",
        deviceId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await db.put(doc);
    },
    [db, deviceId],
  );

  return { addTracker };
}

export function useRemoveTracker() {
  const { db } = useDB();

  const removeTracker = useCallback(
    async (trackerId: string) => {
      const trackerDoc = await db.get(trackerId);
      await db.remove(trackerDoc);
    },
    [db],
  );

  return { removeTracker };
}

export function useUpdateTrackers() {
  const { db } = useDB();

  const updateTrackers = useCallback(
    async (trackers: TrackerDoc[]) => {
      await db.bulkDocs(
        trackers.map((t) => ({
          ...t,
          updatedAt: new Date(),
        })),
      );
    },
    [db],
  );

  return { updateTrackers };
}

import { useDB } from "./DBContext";
import { useCallback, useEffect } from "react";

const DESIGN_DOC = {
  _id: "_design/analytics",
  views: {
    by_tracker: {
      // Emit multiple keys for different types of analysis
      map: ((doc) => {
        if (doc.type === "trackerEntry") {
          // Emit for daily counts
          const dateKey = doc.date.split("T")[0];
          emit([doc.trackerId, "daily", dateKey], 1);

          // Emit for numeric averages
          if (typeof doc.value === "number") {
            emit([doc.trackerId, "value", dateKey], doc.value);
          }

          // Emit for time of day distribution
          emit([doc.trackerId, "timeOfDay", doc.timeOfDay || "all_day"], 1);
        }
      }).toString(),
      reduce: "_stats",
    },
    by_collection: {
      map: ((doc) => {
        if (doc.type === "trackerEntry" && doc.collectionId) {
          const dateKey = doc.date.split("T")[0];
          emit([doc.collectionId, dateKey], 1);
        }
      }).toString(),
      reduce: "_count",
    },
  },
};

export function useAnalytics() {
  const { db } = useDB();

  // Ensure design doc exists
  useEffect(() => {
    async function createDesignDoc() {
      try {
        await db.get(DESIGN_DOC._id);
      } catch (err: any) {
        if (err.name === "not_found") {
          await db.put(DESIGN_DOC);
        }
      }
    }
    createDesignDoc();
  }, [db]);

  const getTrackerAnalytics = useCallback(
    async (trackerId: string, startDate?: Date, endDate?: Date) => {
      const options: any = {
        group: true,
        group_level: 3,
        startkey: [trackerId],
        endkey: [trackerId, {}],
      };

      if (startDate || endDate) {
        options.startkey = [trackerId, "daily", startDate?.toISOString().split("T")[0] || ""];
        options.endkey = [trackerId, "daily", endDate?.toISOString().split("T")[0] || "\ufff0"];
      }

      const result = await db.query("analytics/by_tracker", options);

      // Process results
      const dailyCounts = {};
      const values = {};
      const timeDistribution = {
        morning: 0,
        afternoon: 0,
        night: 0,
        all_day: 0,
      };

      result.rows.forEach((row) => {
        const [_, type, key] = row.key;

        if (type === "daily") {
          dailyCounts[key] = row.value.sum;
        } else if (type === "value") {
          values[key] = {
            average: row.value.sum / row.value.count,
            min: row.value.min,
            max: row.value.max,
            count: row.value.count,
          };
        } else if (type === "timeOfDay") {
          timeDistribution[key] = row.value.count;
        }
      });

      return {
        dailyCounts,
        values,
        timeDistribution,
        summary: {
          totalEntries: Object.values(dailyCounts).reduce((a: number, b: number) => a + b, 0),
          averageEntriesPerDay:
            Object.keys(dailyCounts).length > 0
              ? Object.values(dailyCounts).reduce((a: number, b: number) => a + b, 0) / Object.keys(dailyCounts).length
              : 0,
        },
      };
    },
    [db],
  );

  const getCollectionAnalytics = useCallback(
    async (collectionId: string, startDate?: Date, endDate?: Date) => {
      const options: any = {
        group: true,
        startkey: [collectionId],
        endkey: [collectionId, {}],
      };

      if (startDate || endDate) {
        options.startkey = [collectionId, startDate?.toISOString().split("T")[0] || ""];
        options.endkey = [collectionId, endDate?.toISOString().split("T")[0] || "\ufff0"];
      }

      const result = await db.query("analytics/by_collection", options);

      const dailyCounts = {};
      result.rows.forEach((row) => {
        const [_, date] = row.key;
        dailyCounts[date] = row.value;
      });

      return {
        dailyCounts,
        summary: {
          totalEntries: Object.values(dailyCounts).reduce((a: number, b: number) => a + b, 0),
          averageEntriesPerDay:
            Object.keys(dailyCounts).length > 0
              ? Object.values(dailyCounts).reduce((a: number, b: number) => a + b, 0) / Object.keys(dailyCounts).length
              : 0,
        },
      };
    },
    [db],
  );

  // Clean up old index data
  const cleanupViews = useCallback(async () => {
    await db.viewCleanup();
  }, [db]);

  return {
    getTrackerAnalytics,
    getCollectionAnalytics,
    cleanupViews,
  };
}

// Example usage:
// const { getTrackerAnalytics } = useAnalytics();
// const stats = await getTrackerAnalytics('tracker123', new Date('2024-01-01'), new Date());
// stats will include:
// - Daily counts of entries
// - Average values per day (for numeric trackers)
// - Time of day distribution
// - Summary statistics

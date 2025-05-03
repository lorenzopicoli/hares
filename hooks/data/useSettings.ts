import { useDatabase } from "@/contexts/DatabaseContext";
import { settingsTable, type NewSettings, type Settings } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useCallback } from "react";

export function useSettingsDatabase() {
  const { db } = useDatabase();

  const { data: settings } = useLiveQuery(db.select().from(settingsTable), [db]);

  const updateSettings = useCallback(
    (updated: NewSettings) => {
      return db.update(settingsTable).set(updated);
    },
    [db],
  );

  const createSettings = useCallback(async () => {
    return db.insert(settingsTable).values({ id: 1 }).onConflictDoNothing();
  }, [db]);

  return { settings: settings[0] as Settings | undefined, updateSettings, createSettings };
}

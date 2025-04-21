import { useDatabase } from "@/contexts/DatabaseContext";
import { useCallback } from "react";
import * as SQLite from "expo-sqlite";
import { DB_NAME } from "@/db/schema";

export const useDeleteDatabase = () => {
  const { db, reloadDb } = useDatabase();
  const deleteDatabase = useCallback(async () => {
    try {
      db.$client.closeSync();
    } catch (err) {
      console.log("Error closing connection, maybe already closed?", err);
    }
    try {
      SQLite.deleteDatabaseSync(DB_NAME);
    } catch (err) {
      console.log("Error deleting DB, maybe doesn't exist?", err);
    }
    await reloadDb();
  }, [db, reloadDb]);
  return {
    deleteDatabase,
  };
};

import { drizzle, type ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from "react";
import * as schema from "@/db/schema";
import type { SQLiteDatabase } from "expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { ThemedText } from "@/components/ThemedText";
import LoadingDatabase from "@/components/LoadingDatabase";
import * as SQLite from "expo-sqlite";

type DrizzleDb = ExpoSQLiteDatabase<typeof schema> & {
  $client: SQLiteDatabase;
};

type DatabaseContextType = {
  db?: DrizzleDb;
  reloadDb: () => void;
};

export const DatabaseContext = createContext<DatabaseContextType | null>(null);
export const DATABASE_NAME = "hares.db";

export const DatabaseProvider = ({ children, onLoad }: PropsWithChildren & { onLoad?: () => void }) => {
  const [error, setError] = useState<string>();
  const [calledLoaded, setCalledLoaded] = useState<boolean>(false);
  const [db, setDb] = useState<
    ExpoSQLiteDatabase<typeof schema> & {
      $client: SQLiteDatabase;
    }
  >();
  const [needReload, setNeedReload] = useState(false);
  const reloadDb = () => {
    setNeedReload(true);
  };
  const internalReload = useCallback(async () => {
    try {
      if (db?.$client) {
        try {
          db.$client.closeSync();
        } catch (e) {
          console.log("close", e);
        }
      }
      setDb(undefined);
      const newDbCon = SQLite.openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
      const newDb = drizzle(newDbCon, { schema, logger: false });
      await migrate(newDb, migrations).catch((e) => {
        setError(JSON.stringify(e));
      });
      setDb(newDb);
    } catch (e) {
      setError(JSON.stringify(e));
    }
  }, [db]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    internalReload();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (needReload) {
      internalReload();
      setNeedReload(false);
    }
  }, [needReload]);

  useEffect(() => {
    if (db && !calledLoaded) {
      onLoad?.();
      setCalledLoaded(true);
    }
  }, [onLoad, calledLoaded, db]);

  if (error || !db || needReload) {
    return <ThemedText>Failed to run migrations {error}</ThemedText>;
  }

  return (
    <>
      <DatabaseContext.Provider value={{ reloadDb, db: db as NonNullable<typeof db> }}>
        {!db ? <LoadingDatabase /> : children}
      </DatabaseContext.Provider>
    </>
  );
};

interface DatabaseType {
  db: DrizzleDb;
  reloadDb: () => void;
}

export const useDatabase = (): DatabaseType => {
  const store = useContext(DatabaseContext);

  if (!store) {
    throw new Error("useDb must be inside a DatabaseProvider");
  }

  const db = store.db;

  if (!db) {
    throw new Error("Trying to use useDb before database is initialized");
  }

  return {
    db,
    reloadDb: store.reloadDb,
  };
};

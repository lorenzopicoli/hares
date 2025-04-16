import { drizzle, type ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
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
};

export const DatabaseContext = createContext<DatabaseContextType | null>(null);
const dbCon = SQLite.openDatabaseSync("hares.db", { enableChangeListener: true });
const db = drizzle(dbCon, { schema });

export const DatabaseProvider = ({ children, onLoad }: PropsWithChildren & { onLoad?: () => void }) => {
  const [migrationError, setMigrationError] = useState<string>();
  const [migrationDone, setMigrationDone] = useState<boolean>(false);
  const [calledLoaded, setCalledLoaded] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await migrate(db, migrations).catch((e) => {
        setMigrationError(JSON.stringify(e));
      });
      setMigrationDone(true);
    })();
  }, []);

  useEffect(() => {
    if (db && !calledLoaded) {
      onLoad?.();
      setCalledLoaded(true);
    }
  }, [onLoad, calledLoaded]);

  if (migrationError) {
    return <ThemedText>Failed to run migrations {migrationError}</ThemedText>;
  }

  return (
    <>
      <DatabaseContext.Provider value={{ db }}>
        {!migrationDone ? <LoadingDatabase /> : children}
      </DatabaseContext.Provider>
    </>
  );
};

interface DatabaseType {
  db: DrizzleDb;
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
  };
};

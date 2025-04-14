import { drizzle, type ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import * as schema from "@/db/schema";
import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import { ThemedText } from "@/components/ThemedText";
import LoadingDatabase from "@/components/LoadingDatabase";

type DrizzleDb = ExpoSQLiteDatabase<typeof schema> & {
  $client: SQLiteDatabase;
};

type DatabaseContextType = {
  db?: DrizzleDb;
};

export const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const DatabaseProvider = ({ children, onLoad }: PropsWithChildren & { onLoad?: () => void }) => {
  const [db, setDb] = useState<DrizzleDb>();
  const [migrationError, setMigrationError] = useState<string>();
  const [calledLoaded, setCalledLoaded] = useState<boolean>(false);
  const dbCon = useSQLiteContext();

  useEffect(() => {
    (async () => {
      if (db) {
        return;
      }
      const dbDrizzle = drizzle(dbCon, { schema });
      await migrate(dbDrizzle, migrations).catch((e) => {
        setMigrationError(JSON.stringify(e));
      });
      setDb(dbDrizzle);
    })();
  }, [dbCon, db]);

  useEffect(() => {
    if (db && !calledLoaded) {
      onLoad?.();
      setCalledLoaded(true);
    }
  }, [db, onLoad, calledLoaded]);

  if (migrationError) {
    return <ThemedText>Failed to run migrations {migrationError}</ThemedText>;
  }

  return (
    <>
      <DatabaseContext.Provider value={{ db }}>{!db ? <LoadingDatabase /> : children}</DatabaseContext.Provider>
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

import * as SQLite from "expo-sqlite";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/expo-sqlite";

export const dbName = "hares.db";
export const dbConn = SQLite.openDatabaseSync(dbName, { enableChangeListener: true });

export const db = drizzle(dbConn, { schema });

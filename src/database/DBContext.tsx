import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import PouchDB from "pouchdb-browser";
import { useLocalStorage } from "@mantine/hooks";
import { v4 as uuidv4 } from "uuid";
import PouchdbFind from "pouchdb-find";

PouchDB.plugin(PouchdbFind);

const DB_NAME = "hares_db";

interface DBContextType {
  db: PouchDB.Database;
  deviceId: string;
  isConnected: boolean;
  isCheckingConnection: boolean;
}

const DBContext = createContext<DBContextType | null>(null);

export function DBProvider({ children }: { children: ReactNode }) {
  const [db] = useState(() => new PouchDB(DB_NAME));
  const [isConnected, setIsConnected] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  const syncRef = useRef<PouchDB.Replication.Sync<{}> | null>(null);
  const remoteDBRef = useRef<PouchDB.Database | null>(null);

  const [deviceId] = useLocalStorage({
    key: "deviceId",
    defaultValue: uuidv4(),
  });

  const [serverHost] = useLocalStorage<string>({
    key: "serverHost",
    defaultValue: "",
  });

  const [username] = useLocalStorage<string>({
    key: "dbUsername",
    defaultValue: "",
  });

  const [password] = useLocalStorage<string>({
    key: "dbPassword",
    defaultValue: "",
  });

  useEffect(() => {
    db.createIndex({
      index: { fields: ["type", "createdAt"] },
    });
  }, [db]);

  useEffect(() => {
    if (!serverHost || !username || !password) {
      setIsConnected(false);
      return;
    }

    const checkConnection = async () => {
      if (remoteDBRef.current) {
        try {
          await remoteDBRef.current.info();
          setIsConnected(true);
        } catch (err) {
          console.error("Connection check failed:", err);
          setIsConnected(false);
        }
      }
    };

    const cleanupSync = async () => {
      if (syncRef.current) {
        syncRef.current.cancel();
        syncRef.current = null;
      }
      if (remoteDBRef.current) {
        await remoteDBRef.current.close();
        remoteDBRef.current = null;
      }
    };

    const setupSync = async () => {
      setIsCheckingConnection(true);
      try {
        // Always create a new remote DB instance
        await cleanupSync();
        remoteDBRef.current = new PouchDB(`${serverHost}/${DB_NAME}`, {
          auth: { username, password },
        });

        await remoteDBRef.current.info();

        syncRef.current = db
          .sync(remoteDBRef.current, {
            live: true,
            retry: true,
          })
          .on("error", async (err) => {
            console.error("Sync error:", err);
            setIsConnected(false);
            // Clean up on error to allow for reconnection
            await cleanupSync();
          })
          .on("active", () => {
            console.log("ACTIVE");
            setIsConnected(true);
          })
          .on("paused", (err) => {
            console.log("PAUSED");
            setIsConnected(!err);
          });
      } catch (err) {
        console.error("Connection setup failed:", err);
        setIsConnected(false);
        await cleanupSync();
      } finally {
        setIsCheckingConnection(false);
      }
    };

    setupSync();
    const interval = setInterval(checkConnection, 30000);

    return () => {
      clearInterval(interval);
      if (syncRef.current) {
        syncRef.current.cancel();
        syncRef.current = null;
      }
      if (remoteDBRef.current) {
        remoteDBRef.current.close();
        remoteDBRef.current = null;
      }
    };
  }, [serverHost, username, password, db]);

  const value = {
    db,
    deviceId,
    isConnected,
    isCheckingConnection,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}

export function useDB() {
  const context = useContext(DBContext);
  if (!context) {
    throw new Error("useDB must be used within a DBProvider");
  }
  return context;
}

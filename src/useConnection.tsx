import { useState, useEffect } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { v4 } from "uuid";
import PouchDB from "pouchdb-browser";
import { useDB } from "./useDb";

export function useConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const { db } = useDB();

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

  const [deviceId] = useLocalStorage<string>({
    key: "deviceId",
    defaultValue: v4(),
  });

  // Check server connection when URL changes
  useEffect(() => {
    if (!serverHost || !username || !password) {
      setIsConnected(false);
      return;
    }

    const checkConnection = async () => {
      setIsCheckingConnection(true);
      try {
        const remoteDB = new PouchDB(`${serverHost}/hares_db`, {
          auth: {
            username,
            password,
          },
        });
        await remoteDB.info();
        const sync = db
          .sync(remoteDB, {
            live: true,
            retry: true,
          })
          .on("error", console.error);
        setIsConnected(true);

        // Cleanup on unmount
        return () => {
          sync.cancel();
          remoteDB.close();
        };
      } catch (err) {
        console.error("Connection check failed:", err);
        setIsConnected(false);
      } finally {
        setIsCheckingConnection(false);
      }
    };

    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [serverHost, username, password, db]);

  return {
    isConnected,
    isCheckingConnection,
    deviceId,
  };
}

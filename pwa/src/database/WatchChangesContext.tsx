import React, { createContext, useContext, useEffect, useCallback, type ReactNode } from "react";
import { useDB } from "./DBContext";

interface WatchChangesContextType {
  subscribeToChanges: (callback: () => void) => () => void;
}

const WatchChangesContext = createContext<WatchChangesContextType | null>(null);

interface WatchChangesProviderProps {
  children: ReactNode;
}

export function WatchChangesProvider({ children }: WatchChangesProviderProps) {
  const { db } = useDB();

  const callbacks = React.useRef<Set<() => void>>(new Set());

  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  const changesFeed = React.useRef<PouchDB.Core.Changes<{}>>(null);

  const initializeChangesFeed = useCallback(() => {
    if (!changesFeed.current) {
      changesFeed.current = db
        .changes({
          since: "now",
          live: true,
          include_docs: true,
        })
        .on("change", () => {
          console.log("On change - notifying", callbacks.current.size, "listeners");
          for (const callback of callbacks.current) {
            callback();
          }
        })
        .on("error", (err) => {
          console.error("Changes feed error:", err);
        });
    }
  }, [db]);

  const subscribeToChanges = useCallback(
    (callback: () => void) => {
      initializeChangesFeed();

      callbacks.current.add(callback);

      return () => {
        callbacks.current.delete(callback);

        if (callbacks.current.size === 0 && changesFeed.current) {
          changesFeed.current.cancel();
          changesFeed.current = null;
        }
      };
    },
    [initializeChangesFeed],
  );

  useEffect(() => {
    return () => {
      if (changesFeed.current) {
        changesFeed.current.cancel();
        changesFeed.current = null;
      }
    };
  }, []);

  const contextValue = {
    subscribeToChanges,
  };

  return <WatchChangesContext.Provider value={contextValue}>{children}</WatchChangesContext.Provider>;
}

export function useWatchChanges(onChange: () => void) {
  const context = useContext(WatchChangesContext);

  if (!context) {
    throw new Error("useWatchChanges must be used within a WatchChangesProvider");
  }

  useEffect(() => {
    return context.subscribeToChanges(onChange);
  }, [context, onChange]);
}

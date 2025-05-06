import { useDatabase } from "@/contexts/DatabaseContext";
import { exportLogsTable } from "@/db/schema";
import { desc, getTableColumns, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useExportLogs() {
  const { db } = useDatabase();
  const { data: exportLogs } = useLiveQuery(
    db
      .select({
        ...getTableColumns(exportLogsTable),
        duration: sql`${exportLogsTable.finishedAt} - ${exportLogsTable.createdAt}`.mapWith(Number),
      })
      .from(exportLogsTable)
      .orderBy(desc(exportLogsTable.createdAt)),
    [],
  );

  return { exportLogs };
}

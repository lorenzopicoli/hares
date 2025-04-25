import { useDatabase } from "@/contexts/DatabaseContext";
import { entriesTable } from "@/db/schema";
import { count, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";

export const formatDate = (dateColumn: SQLiteColumn, format = "%Y-%m-%d") => {
  return sql`strftime('${sql.raw(format)}', ${dateColumn}, 'unixepoch')`;
};

export enum DateGroupingPeriod {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
  yearly = "yearly",
}

const formatDateByPeriod = (dateColumn: SQLiteColumn, groupPeriod: DateGroupingPeriod) => {
  switch (groupPeriod) {
    case "daily":
      return formatDate(dateColumn, "%Y-%m-%d");
    case "weekly":
      return formatDate(dateColumn, "%Y-%W");
    case "monthly":
      return formatDate(dateColumn, "%Y-%m");
    case "yearly":
      return formatDate(dateColumn, "%Y");
  }
  return formatDate(dateColumn, "%Y-%m-%d");
};
export function useEntryCountStats(params: {
  trackerId: number;
  groupPeriod: DateGroupingPeriod;
}) {
  const { trackerId, groupPeriod } = params;
  const { db } = useDatabase();
  const { data: entryCountStats } = useLiveQuery(
    db
      .select({
        date: formatDateByPeriod(entriesTable.date, groupPeriod),
        value: count(entriesTable.id),
      })
      .from(entriesTable)
      .where(sql`${entriesTable.trackerId} = ${trackerId}`)
      .groupBy(formatDateByPeriod(entriesTable.date, groupPeriod))
      .orderBy(formatDateByPeriod(entriesTable.date, groupPeriod)),
    [trackerId, groupPeriod],
  );

  return { entryCountStats };
}

import { sql } from "drizzle-orm";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";

export const formatSqlDate = (dateColumn: SQLiteColumn, format = "%Y-%m-%d") => {
  return sql`strftime('${sql.raw(format)}', ${dateColumn}, 'unixepoch')`;
};

export enum DateGroupingPeriod {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
  yearly = "yearly",
}

export const formatSqlDateByGroupingPeriod = (dateColumn: SQLiteColumn, groupPeriod: DateGroupingPeriod) => {
  switch (groupPeriod) {
    case "daily":
      return formatSqlDate(dateColumn, "%Y-%m-%d");
    case "weekly":
      return formatSqlDate(dateColumn, "%Y-%W");
    case "monthly":
      return formatSqlDate(dateColumn, "%Y-%m");
    case "yearly":
      return formatSqlDate(dateColumn, "%Y");
  }
  return formatSqlDate(dateColumn, "%Y-%m-%d");
};

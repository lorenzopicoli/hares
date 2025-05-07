import type { StatsDateRange } from "@/components/BottomSheets/StatsScreenOptionsBottomSheet";
import { addDays, addMonths, addWeeks, addYears, format } from "date-fns";
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

const groupingPeriodToFormat = (groupPeriod: DateGroupingPeriod) => {
  switch (groupPeriod) {
    case "daily":
      return "yyyy-MM-dd";
    case "weekly":
      return "yyyy-II";
    case "monthly":
      return "yyyy-MM";
    default:
      return "yyyy";
  }
};

const groupingToIncrementFunction = (groupPeriod: DateGroupingPeriod) => {
  switch (groupPeriod) {
    case "daily":
      return addDays;
    case "weekly":
      return addWeeks;
    case "monthly":
      return addMonths;
    default:
      return addYears;
  }
};

export const getExpandedData = (
  period: StatsDateRange,
  grouping: DateGroupingPeriod,
  points: { date: string; value: number }[],
) => {
  const data = [];
  const formatStr = groupingPeriodToFormat(grouping);
  const incrementFun = groupingToIncrementFunction(grouping);

  let currentDate = period.startDate;
  let prevVal = 0;

  while (currentDate < period.endDate) {
    const date = format(currentDate, formatStr);
    const dayData = points.find((entry) => entry.date === date);

    data.push({
      date,
      value: dayData?.value ?? prevVal,
    });
    if (dayData?.value) {
      prevVal = dayData.value;
    }
    currentDate = incrementFun(currentDate, 1);
  }

  return data;
};

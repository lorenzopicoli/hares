import type { StatsDateRange } from "@/components/BottomSheets/StatsScreenOptionsBottomSheet";
import { useDatabase } from "@/contexts/DatabaseContext";
import { entriesTable } from "@/db/schema";
import { type DateGroupingPeriod, formatSqlDateByGroupingPeriod } from "@/utils/dateGroupPeriod";
import { sqlFromGroupFunction, type GroupFunction } from "@/utils/groupFunctions";
import { sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useNumberTrackerLineStats(params: {
  trackerId: number;
  groupPeriod: DateGroupingPeriod;
  groupFun: GroupFunction;
  dateRange: StatsDateRange;
}) {
  const { trackerId, groupPeriod, groupFun, dateRange } = params;
  const { db } = useDatabase();
  const { data: entriesNumberValueStats } = useLiveQuery(
    db
      .select({
        date: formatSqlDateByGroupingPeriod(entriesTable.date, groupPeriod).mapWith(String),
        value: sqlFromGroupFunction(groupFun, entriesTable.numberValue).mapWith(Number),
      })
      .from(entriesTable)
      .where(sql`${entriesTable.trackerId} = ${trackerId} AND
        ${entriesTable.date} > ${dateRange.startDate.valueOf() / 1000} AND
        ${entriesTable.date} < ${dateRange.endDate.valueOf() / 1000}`)
      .groupBy(formatSqlDateByGroupingPeriod(entriesTable.date, groupPeriod))
      .orderBy(formatSqlDateByGroupingPeriod(entriesTable.date, groupPeriod)),
    [trackerId, groupPeriod, groupFun, dateRange.startDate, dateRange.endDate],
  );

  return { entriesNumberValueStats };
}

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
}) {
  const { trackerId, groupPeriod, groupFun } = params;
  const { db } = useDatabase();
  const { data: entriesNumberValueStats } = useLiveQuery(
    db
      .select({
        date: formatSqlDateByGroupingPeriod(entriesTable.date, groupPeriod),
        value: sqlFromGroupFunction(groupFun, entriesTable.numberValue),
      })
      .from(entriesTable)
      .where(sql`${entriesTable.trackerId} = ${trackerId}`)
      .groupBy(formatSqlDateByGroupingPeriod(entriesTable.date, groupPeriod))
      .orderBy(formatSqlDateByGroupingPeriod(entriesTable.date, groupPeriod)),
    [trackerId, groupPeriod, groupFun],
  );

  return { entriesNumberValueStats };
}

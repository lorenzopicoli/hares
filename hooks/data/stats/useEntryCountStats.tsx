import type { StatsDateRange } from "@/components/BottomSheets/ChartOptionsBottomSheet";
import { useDatabase } from "@/contexts/DatabaseContext";
import { entriesTable } from "@/db/schema";
import { type DateGroupingPeriod, formatSqlDateByGroupingPeriod } from "@/utils/dateGroupPeriod";
import { count, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useEntryCountStats(params: {
  trackerId: number;
  groupPeriod: DateGroupingPeriod;
  dateRange: StatsDateRange;
}) {
  const { trackerId, groupPeriod, dateRange } = params;
  const { db } = useDatabase();
  const { data: entryCountStats } = useLiveQuery(
    db
      .select({
        date: formatSqlDateByGroupingPeriod(entriesTable.date, groupPeriod),
        value: count(entriesTable.id),
      })
      .from(entriesTable)
      .where(sql`${entriesTable.trackerId} = ${trackerId} AND
        ${entriesTable.date} > ${dateRange.startDate.valueOf() / 1000} AND
        ${entriesTable.date} < ${dateRange.endDate.valueOf() / 1000}`)
      .groupBy(formatSqlDateByGroupingPeriod(entriesTable.date, groupPeriod))
      .orderBy(formatSqlDateByGroupingPeriod(entriesTable.date, groupPeriod)),
    [trackerId, groupPeriod, dateRange.startDate, dateRange.endDate],
  );

  return { entryCountStats };
}

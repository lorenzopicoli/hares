import type { StatsDateRange } from "@/components/BottomSheets/StatsScreenOptionsBottomSheet";
import { useDatabase } from "@/contexts/DatabaseContext";
import { entriesTable } from "@/db/schema";
import { type DateGroupingPeriod, formatSqlDateByGroupingPeriod } from "@/utils/dateGroupPeriod";
import { sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useEntryCountStats(params: {
  trackerId: number;
  groupPeriod: DateGroupingPeriod;
  dateRange: StatsDateRange;
}) {
  const { trackerId, groupPeriod, dateRange } = params;
  const { db } = useDatabase();
  const groupedDate = formatSqlDateByGroupingPeriod(entriesTable.date, groupPeriod);

  const { data: entryCountStats } = useLiveQuery(
    db
      .select({
        date: groupedDate,
        value: sql<number>`SUM(COUNT(${entriesTable.id})) OVER (
          ORDER BY ${groupedDate}
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        )`.as("value"),
      })
      .from(entriesTable)
      .where(sql`${entriesTable.trackerId} = ${trackerId} AND
        ${entriesTable.date} > ${dateRange.startDate.valueOf() / 1000} AND
        ${entriesTable.date} < ${dateRange.endDate.valueOf() / 1000}`)
      .groupBy(groupedDate)
      .orderBy(groupedDate),
    [trackerId, groupPeriod, dateRange.startDate, dateRange.endDate],
  );

  return { entryCountStats };
}

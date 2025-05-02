import type { StatsDateRange } from "@/components/BottomSheets/StatsScreenOptionsBottomSheet";
import { useDatabase } from "@/contexts/DatabaseContext";
import { entriesTable, textListEntriesTable } from "@/db/schema";
import { count, sql, desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useTopTextListStats(params: {
  trackerId: number;
  limit: number;
  includeOthers: boolean;
  dateRange: StatsDateRange;
}) {
  const { trackerId, dateRange, limit } = params;
  const { db } = useDatabase();
  const { data: textListUsageCount } = useLiveQuery(
    db
      .select({
        name: textListEntriesTable.name,
        value: count(textListEntriesTable.name),
      })
      .from(textListEntriesTable)
      .innerJoin(entriesTable, eq(textListEntriesTable.entryId, entriesTable.id))
      .where(sql`${textListEntriesTable.trackerId} = ${trackerId} AND
        ${entriesTable.date} > ${dateRange.startDate.valueOf() / 1000} AND
        ${entriesTable.date} < ${dateRange.endDate.valueOf() / 1000}
        `)
      .groupBy(textListEntriesTable.name)
      .orderBy(desc(count(textListEntriesTable.name)))
      .limit(limit),
    [trackerId, limit, dateRange],
  );

  //   const { data: othersCount } = useLiveQuery(
  //     db
  //       .select({
  //         value: count(textListEntriesTable.name),
  //       })
  //       .from(textListEntriesTable)
  //       .where(
  //         and(
  //           sql`${textListEntriesTable.trackerId} = ${trackerId}`,
  //           sql`${textListEntriesTable.name} NOT IN (${sql.join(topNames.map((n) => n.name))})`,
  //         ),
  //       ),
  //     [trackerId, topNames],
  //   );

  //   const textListUsageCount = useMemo(
  //     () => (includeOthers ? [{ name: "Others", value: othersCount[0]?.value }, ...topNames] : topNames),
  //     [topNames, othersCount, includeOthers],
  //   );

  return { textListUsageCount };
}

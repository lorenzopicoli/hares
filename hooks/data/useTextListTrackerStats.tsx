import { useDatabase } from "@/contexts/DatabaseContext";
import { textListEntriesTable } from "@/db/schema";
import { count, sql, desc, and } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

export function useTextListTrackerStats(params: {
  trackerId: number;
  limit: number;
  showOthers: boolean;
}) {
  const { trackerId, limit, showOthers } = params;
  const { db } = useDatabase();
  const { data: topNames } = useLiveQuery(
    db
      .select({
        name: textListEntriesTable.name,
        value: count(textListEntriesTable.name),
      })
      .from(textListEntriesTable)
      .where(sql`${textListEntriesTable.trackerId} = ${trackerId}`)
      .groupBy(textListEntriesTable.name)
      .orderBy(desc(count(textListEntriesTable.name)))
      .limit(limit),
    [trackerId, limit],
  );

  const { data: othersCount } = useLiveQuery(
    db
      .select({
        value: count(textListEntriesTable.name),
      })
      .from(textListEntriesTable)
      .where(
        and(
          sql`${textListEntriesTable.trackerId} = ${trackerId}`,
          sql`${textListEntriesTable.name} NOT IN (${sql.join(topNames.map((n) => n.name))})`,
        ),
      ),
    [trackerId, topNames],
  );

  const textListUsageCount = useMemo(
    () => (showOthers ? [{ name: "Others", value: othersCount[0]?.value }, ...topNames] : topNames),
    [topNames, othersCount, showOthers],
  );

  return { textListUsageCount };
}

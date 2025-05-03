import { useDatabase } from "@/contexts/DatabaseContext";
import { trackersTable } from "@/db/schema";
import { inArray, sql, type SQL } from "drizzle-orm";
import { useCallback } from "react";

export function useReorderTrackers() {
  const { db } = useDatabase();

  const reorderTrackers = useCallback(
    async (data: { trackerId: number; index: number }[]) => {
      if (data.length === 0) {
        return;
      }

      const sqlChunks: SQL[] = [];
      const ids: number[] = [];

      sqlChunks.push(sql`(case`);

      for (const input of data) {
        sqlChunks.push(sql`when ${trackersTable.id} = ${input.trackerId} then ${input.index}`);
        ids.push(input.trackerId);
      }

      sqlChunks.push(sql`end)`);

      const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));

      await db.update(trackersTable).set({ index: finalSql }).where(inArray(trackersTable.id, ids));
    },
    [db],
  );

  return { reorderTrackers };
}

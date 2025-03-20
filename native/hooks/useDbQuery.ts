import type { AnySQLiteTable, SQLiteSelect } from "drizzle-orm/sqlite-core";
import { useState, useEffect } from "react";

interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error: any | null;
}

const useDbQuery = <T extends AnySQLiteTable>(query: SQLiteSelect): UseQueryResult<Awaited<T["$inferSelect"]>> => {
  const [data, setData] = useState<Awaited<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [error, setError] = useState<any | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await query;
        setData(result);
        setLoading(false);

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (err: any) {
        setLoading(false);
        setError(err);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useDbQuery;

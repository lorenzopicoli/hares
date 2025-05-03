import { avg, max, min, sum, type SQL } from "drizzle-orm";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";

export enum GroupFunction {
  avg = "avg",
  sum = "sum",
  max = "max",
  min = "min",
}

export function sqlFromGroupFunction(fun: GroupFunction, column: SQLiteColumn | SQL<unknown>) {
  switch (fun) {
    case GroupFunction.avg:
      return avg(column);
    case GroupFunction.sum:
      return sum(column);
    case GroupFunction.max:
      return max(column);
    case GroupFunction.min:
      return min(column);
  }
}

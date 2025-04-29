import type { Tracker } from "@/db/schema";
import type { EChartsCoreOption } from "echarts";
import { useCallback, useMemo } from "react";
import { Chart } from "./Chart";
import type { DateGroupingPeriod } from "@/utils/dateGroupPeriod";
import type { GroupFunction } from "@/utils/groupFunctions";
import { useNumberTrackerLineStats } from "@/hooks/data/stats/useNumberTrackerLineStats";
import { addDays, format, parse } from "date-fns";
import { View } from "react-native";

export function CalendarHeatmapChart(props: {
  tracker: Tracker;
  groupPeriod: DateGroupingPeriod;
  groupFun: GroupFunction;
}) {
  const { tracker, groupFun, groupPeriod } = props;

  const { entriesNumberValueStats } = useNumberTrackerLineStats({ trackerId: tracker.id, groupPeriod, groupFun });
  const getVirtualData = useCallback(
    (year: number) => {
      const startDate = parse(`${year}-01-01`, "yyyy-MM-dd", new Date());
      const endDate = parse(`${year + 1}-01-01`, "yyyy-MM-dd", new Date());
      const data = [];

      let currentDate = startDate;
      while (currentDate < endDate) {
        const date = format(currentDate, "yyyy-MM-dd");
        const dayData = entriesNumberValueStats.find((entry) => entry.date === date);
        data.push({
          itemStyle: {
            borderWidth: 1,
            borderRadius: 4,
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowBlur: dayData?.value ? 7 : 0,
          },
          value: [date, dayData?.value ?? -1],
        });
        currentDate = addDays(currentDate, 1);
      }

      return data;
    },
    [entriesNumberValueStats],
  );
  const option: EChartsCoreOption = useMemo(
    () => ({
      tooltip: {},
      visualMap: {
        min: 0,
        max: 20,
        type: "piecewise",
        orient: "horizontal",
        left: "center",
      },
      calendar: {
        left: 50,
        right: 30,
        cellSize: ["auto", 18],
        range: ["2025-01-01", "2025-04-26"],
        yearLabel: { show: false },
      },
      series: {
        type: "heatmap",
        coordinateSystem: "calendar",

        name: "Value",

        data: getVirtualData(2025),
      },
    }),
    [getVirtualData],
  );

  return (
    <View
      style={{
        flex: 1,
        marginLeft: 40,
        marginRight: 40,
        height: 270,
      }}
    >
      <Chart option={option} />
    </View>
  );
}

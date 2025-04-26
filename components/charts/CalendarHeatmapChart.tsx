import type { Tracker } from "@/db/schema";
import type { EChartsCoreOption } from "echarts";
import { useMemo } from "react";
import { Chart } from "./Chart";
import type { DateGroupingPeriod } from "@/utils/dateGroupPeriod";
import type { GroupFunction } from "@/utils/groupFunctions";
import { useNumberTrackerLineStats } from "@/hooks/data/stats/useNumberTrackerLineStats";
import { addDays, format, parse } from "date-fns";

export function CalendarHeatmapChart(props: {
  tracker: Tracker;
  groupPeriod: DateGroupingPeriod;
  groupFun: GroupFunction;
}) {
  const { tracker, groupFun, groupPeriod } = props;

  const { entriesNumberValueStats } = useNumberTrackerLineStats({ trackerId: tracker.id, groupPeriod, groupFun });
  function getVirtualData(year: number) {
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
          //   padding: 10,
          //   shadowColor: dayData?.value ? "blue" : "grey",
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowBlur: dayData?.value ? 7 : 0,
          //   shadowOffsetY: 0.2,
          //   shadowOffsetX: 0.2,
        },
        value: [date, dayData?.value ?? -1],
      });
      currentDate = addDays(currentDate, 1);
    }

    return data;
  }
  const option: EChartsCoreOption = useMemo(
    () => ({
      title: {
        top: 30,
        left: "center",
        text: `${tracker.name}`,
      },
      tooltip: {},
      visualMap: {
        min: 0,
        max: 20,
        type: "piecewise",
        orient: "horizontal",
        left: "center",
        top: 65,
      },
      calendar: {
        top: 120,
        left: 50,
        right: 30,
        cellSize: ["auto", 20],
        range: ["2025-01-01", "2025-04-26"],
        yearLabel: { show: false },
      },
      series: {
        type: "heatmap",
        coordinateSystem: "calendar",

        name: "Value",
        // itemStyle: {
        //   borderWidth: 1,
        //   borderRadius: 4,
        //   //   padding: 10,
        //   shadowColor: "grey",
        //   shadowOffsetY: 0.2,
        //   shadowOffsetX: 0.2,
        // },

        data: getVirtualData(2025),
        // data: entriesNumberValueStats.map((e) => [e.date, e.value]),
      },
    }),
    [entriesNumberValueStats, tracker.name],
  );

  return <Chart option={option} />;
}

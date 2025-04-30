import type { Tracker } from "@/db/schema";
import type { EChartsCoreOption } from "echarts";
import { useCallback, useMemo } from "react";
import { Chart } from "./Chart";
import type { DateGroupingPeriod } from "@/utils/dateGroupPeriod";
import type { GroupFunction } from "@/utils/groupFunctions";
import { useNumberTrackerLineStats } from "@/hooks/data/stats/useNumberTrackerLineStats";
import { addDays, format } from "date-fns";
import { View } from "react-native";
import type { StatsDateRange } from "../BottomSheets/ChartOptionsBottomSheet";

export function CalendarHeatmapChart(props: {
  tracker: Tracker;
  dateRange: StatsDateRange;
  groupPeriod: DateGroupingPeriod;
  groupFun: GroupFunction;
}) {
  const { tracker, dateRange, groupFun, groupPeriod } = props;

  const { entriesNumberValueStats } = useNumberTrackerLineStats({
    trackerId: tracker.id,
    groupPeriod,
    groupFun,
    dateRange,
  });
  const getVirtualData = useCallback(() => {
    const data = [];

    let currentDate = dateRange.startDate;
    let min = null;
    let max = null;
    while (currentDate < dateRange.endDate) {
      const date = format(currentDate, "yyyy-MM-dd");
      const dayData = entriesNumberValueStats.find((entry) => entry.date === date);
      if (dayData && (max === null || dayData?.value > max)) {
        max = dayData.value;
      }
      if (dayData && (min === null || dayData?.value < min)) {
        min = dayData.value;
      }

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

    return { data, min, max };
  }, [entriesNumberValueStats, dateRange]);
  const chartData = useMemo(() => getVirtualData(), [getVirtualData]);
  const option: EChartsCoreOption = useMemo(
    () => ({
      tooltip: {},
      visualMap: {
        min: Math.max(chartData.min ?? 0, 0),
        max: chartData.max ?? 0,
        type: "piecewise",
        orient: "horizontal",
        left: "center",
      },
      calendar: {
        left: 50,
        right: 30,
        cellSize: ["auto", 18],
        range: [format(dateRange.startDate, "yyyy-MM-dd"), format(dateRange.endDate, "yyyy-MM-dd")],
        yearLabel: { show: false },
      },
      series: {
        type: "heatmap",
        coordinateSystem: "calendar",

        name: "Value",

        data: chartData.data,
      },
    }),
    [chartData, dateRange],
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

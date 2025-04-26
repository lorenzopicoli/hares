import type { Tracker } from "@/db/schema";
import { useEntryCountStats } from "@/hooks/data/stats/useEntryCountStats";
import type { EChartsCoreOption } from "echarts";
import { useMemo } from "react";
import { Chart } from "./Chart";
import type { DateGroupingPeriod } from "@/utils/dateGroupPeriod";
import { useNumberTrackerLineStats } from "@/hooks/data/stats/useNumberTrackerLineStats";
import type { GroupFunction } from "@/utils/groupFunctions";

export function EntryCountLineChart(props: {
  tracker: Tracker;
  groupPeriod: DateGroupingPeriod;
}) {
  const { tracker, groupPeriod } = props;
  //   const chartRef = useRef<ChartRef>(null);

  const { entryCountStats } = useEntryCountStats({ trackerId: tracker.id, groupPeriod });
  const option: EChartsCoreOption = useMemo(
    () => ({
      title: {
        text: `Number of entries ${groupPeriod}`,
        subtext: tracker.name,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        data: entryCountStats.map((t) => t.date),
      },
      yAxis: {},
      series: [
        {
          data: entryCountStats.map((t) => t.value),
          type: "line",
          name: "No. of entries",
        },
      ],
    }),
    [entryCountStats, tracker.name, groupPeriod],
  );

  return <Chart option={option} />;
}

export function NumberTrackersLineChart(props: {
  tracker: Tracker;
  groupPeriod: DateGroupingPeriod;
  groupFun: GroupFunction;
}) {
  const { tracker, groupPeriod, groupFun } = props;
  //   const chartRef = useRef<ChartRef>(null);

  const { entriesNumberValueStats } = useNumberTrackerLineStats({ trackerId: tracker.id, groupPeriod, groupFun });
  const option: EChartsCoreOption = useMemo(
    () => ({
      title: {
        text: `Entries values ${groupPeriod} (${groupFun})`,
        subtext: tracker.name,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        data: entriesNumberValueStats.map((t) => t.date),
      },
      yAxis: {},
      series: [
        {
          data: entriesNumberValueStats.map((t) => t.value),
          type: "line",
          name: "Value",
        },
      ],
    }),
    [entriesNumberValueStats, tracker.name, groupPeriod, groupFun],
  );

  return <Chart option={option} />;
}

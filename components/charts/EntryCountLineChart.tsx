import type { Tracker } from "@/db/schema";
import { useEntryCountStats, type DateGroupingPeriod } from "@/hooks/data/stats/useEntryCountStats";
import type { EChartsCoreOption } from "echarts";
import { useMemo } from "react";
import { Chart } from "./Chart";

interface Props {
  tracker: Tracker;
  groupPeriod: DateGroupingPeriod;
}

export default function EntryCountLineChart(props: Props) {
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

import type { Tracker } from "@/db/schema";
import type { EChartsCoreOption } from "echarts";
import { useMemo } from "react";
import { Chart } from "./Chart";
import { useTopTextListStats } from "@/hooks/data/stats/useTopTextListStats";

interface Props {
  limit: number;
  tracker: Tracker;
  includeOthers: boolean;
}

export default function TextListBarChart(props: Props) {
  const { limit, tracker, includeOthers } = props;
  //   const chartRef = useRef<ChartRef>(null);

  const { textListUsageCount } = useTopTextListStats({ trackerId: tracker.id, limit, includeOthers });
  const option: EChartsCoreOption = useMemo(
    () => ({
      title: {
        text: `Top ${limit} text entries`,
        subtext: tracker.name,
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      yAxis: {
        type: "category",
        inverse: true,
        data: textListUsageCount.map((t) => t.name),
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          show: false,
        },
      },
      xAxis: {
        type: "value",
        axisTick: { show: false },
        axisLabel: {
          show: false,
        },
        splitLine: { show: false },
      },
      series: [
        {
          data: textListUsageCount.map((t) => t.value),
          type: "bar",
          label: {
            formatter: "{b} - {c}",
            show: true,
            position: "insideLeft",
          },
        },
      ],
    }),
    [limit, textListUsageCount, tracker.name],
  );

  return <Chart option={option} />;
}

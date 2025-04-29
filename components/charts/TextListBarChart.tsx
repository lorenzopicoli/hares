import type { Tracker } from "@/db/schema";
import type { EChartsCoreOption } from "echarts";
import { useMemo } from "react";
import { Chart } from "./Chart";
import { useTopTextListStats } from "@/hooks/data/stats/useTopTextListStats";
import { Sizes } from "@/constants/Sizes";
import { View } from "react-native";

interface Props {
  limit: number;
  tracker: Tracker;
  includeOthers: boolean;
}

export default function TextListBarChart(props: Props) {
  const { limit, tracker, includeOthers } = props;

  const { textListUsageCount } = useTopTextListStats({ trackerId: tracker.id, limit, includeOthers });
  const option: EChartsCoreOption = useMemo(
    () => ({
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
    [textListUsageCount],
  );

  return (
    <View
      style={{
        flex: 1,
        padding: Sizes.medium,
        marginLeft: 40,
        marginRight: 40,
        height: 300,
      }}
    >
      <Chart option={option} />
    </View>
  );
}

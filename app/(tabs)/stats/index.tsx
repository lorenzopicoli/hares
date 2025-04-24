import ThemedScrollView from "@/components/ThemedScrollView";
import { Chart, type ChartRef } from "@/components/charts/Chart";
import { useLocalSearchParams, useRouter } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import { useMemo, useRef, useState } from "react";
import { useTracker } from "@/hooks/data/useTracker";
import { StyleSheet } from "react-native";
import type { EChartsCoreOption } from "echarts";
import { ThemedView } from "@/components/ThemedView";
import { useColors } from "@/components/ThemeProvider";
import { useTextListTrackerStats } from "@/hooks/data/useTextListTrackerStats";

export default function StatsScreen() {
  const { trackerId: trackerIdParam } = useLocalSearchParams<{
    trackerId?: string;
  }>();

  const router = useRouter();
  const trackerId = useMemo(() => (trackerIdParam ? +trackerIdParam : undefined), [trackerIdParam]);
  const { tracker } = useTracker(trackerId ?? -1);
  const { colors } = useColors();
  const [limit, setLimit] = useState(5);
  const [showOthers, setShowOthers] = useState(false);
  const { textListUsageCount } = useTextListTrackerStats({ trackerId: trackerId ?? -1, limit, showOthers });
  const chartRef = useRef<ChartRef>(null);

  const handleSelectTracker = () => {
    router.navigate({ pathname: "/stats/selectStatTracker" });
  };

  const handleSomeAction = () => {
    // Access the chart instance
    const chart = chartRef.current?.getEchartsInstance();
    if (chart) {
      chart.dispatchAction({
        type: "legendScroll",
        scrollDataIndex: 10,
        //   legendId: string,
      });
    }
  };
  const option: EChartsCoreOption = {
    title: {
      text: `Top ${limit} text entries`,
      subtext: tracker?.name,
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    xAxis: {
      type: "category",
      data: textListUsageCount.map((t) => t.name),
      axisTick: { show: false },
      axisLine: { show: false },
      splitLine: { show: false },
      axisLabel: {
        overflow: "break",
        interval: 0,
        rotate: 70,
      },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
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
          normal: {
            show: true,
            position: "top",
          },
        },

        // label: {
        //   show: true,
        //   formatter: "{c}  {b}",
        //   fontSize: 16,
        //   rotate: 90,
        //   align: "left",
        //   verticalAlign: "middle",
        //   position: "insideBottom",
        //   //     options: posList.reduce((map, pos) => {
        //   //       map[pos] = pos;
        //   //       return map;
        //   //     }, {}),
        //   //   },
        //   distance: 15,

        //   textStyle: {
        //     color: colors.text,
        //   },
        // },
      },
    ],
    // series: [
    //   {
    //     name: tracker?.name,
    //     type: "bar",
    //     label: {
    //       color: colors.text,
    //       show: true,
    //     },
    //     data: textListUsageCount,
    //     emphasis: {
    //       itemStyle: {
    //         shadowBlur: 20,
    //         shadowOffsetX: 0,
    //         shadowColor: "rgba(0, 0, 0, 0.5)",
    //       },
    //     },
    //   },
    // ],
  };
  return (
    <ThemedScrollView>
      <ThemedButton
        title={tracker ? `Selected tracker ${tracker.name}` : "Select a tracker"}
        onPress={handleSelectTracker}
      />
      <ThemedView style={{ height: 500 }}>
        <Chart ref={chartRef} option={option} />
      </ThemedView>
      <ThemedView style={{ height: 500 }}>
        <Chart ref={chartRef} option={option} />
      </ThemedView>
      <ThemedView style={{ height: 500 }}>
        <Chart ref={chartRef} option={option} />
      </ThemedView>
      <ThemedButton title="Next" onPress={handleSomeAction} />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({});

import ThemedScrollView from "@/components/ThemedScrollView";
import { Chart } from "@/components/charts/Chart";
import { useLocalSearchParams, useRouter } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import { useMemo } from "react";
import { useTracker } from "@/hooks/data/useTracker";
import { StyleSheet } from "react-native";
import type { EChartsCoreOption } from "echarts";
import { ThemedView } from "@/components/ThemedView";
import { useColors } from "@/components/ThemeProvider";

export default function StatsScreen() {
  const { trackerId: trackerIdParam } = useLocalSearchParams<{
    trackerId?: string;
  }>();

  const router = useRouter();
  const trackerId = useMemo(() => (trackerIdParam ? +trackerIdParam : undefined), [trackerIdParam]);
  const { tracker } = useTracker(trackerId ?? -1);
  const { colors } = useColors();

  const handleSelectTracker = () => {
    router.navigate({ pathname: "/stats/selectStatTracker" });
  };
  const option: EChartsCoreOption = {
    // title: {
    //   text: "Referer of a Website",
    //   subtext: "Fake Data",
    //   left: "center",
    // },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        label: {
          color: colors.text,
          show: false,
        },
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  return (
    <ThemedScrollView>
      <ThemedButton
        title={tracker ? `Selected tracker ${tracker.name}` : "Select a tracker"}
        onPress={handleSelectTracker}
      />
      <ThemedView style={{ height: 500 }}>
        <Chart option={option} />
      </ThemedView>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({});

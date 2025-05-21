import { SkiaChart } from "@wuba/react-native-echarts";
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import * as echarts from "echarts/core";

import "@/constants/EchartsColors";
import { useColors } from "@/contexts/ThemeContext";

export type ChartRef = {
  getEchartsInstance: () => echarts.ECharts | undefined;
};

export const Chart = forwardRef<ChartRef, { option: echarts.EChartsCoreOption }>(({ option }, ref) => {
  const skiaRef = useRef(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const chartRef = useRef<any>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [chartHeight, setChartHeight] = useState<number>(0);
  const { theme } = useColors();

  // Expose the chart instance through the ref
  useImperativeHandle(ref, () => ({
    getEchartsInstance: () => chartRef.current,
  }));

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let chart: echarts.ECharts;
    if (skiaRef.current) {
      chart = echarts.init(skiaRef.current, theme === "dark" ? "haresDark" : "haresLight", {
        renderer: "canvas",
        width: chartWidth,
        height: chartHeight,
      });
      chart.setOption(option);

      chartRef.current = chart;
    }
    return () => chart?.dispose();
  }, [option, theme]);

  useEffect(() => {
    chartRef.current?.resize({
      width: chartWidth,
      height: chartHeight,
    });
  }, [chartWidth, chartHeight]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setChartWidth(width);
    setChartHeight(height);
  };

  return (
    <View style={{ flex: 1, marginLeft: -40, marginRight: -40 }} onLayout={handleLayout}>
      <SkiaChart useRNGH={false} ref={skiaRef} />
    </View>
  );
});

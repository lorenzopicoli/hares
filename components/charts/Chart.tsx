import { SkiaChart, SkiaRenderer } from "@wuba/react-native-echarts";
import * as echarts from "echarts/core";
import { useRef, useEffect, useState } from "react";
import { BarChart, PieChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components";
import { ThemedView } from "../ThemedView";
import { useWindowDimensions, type LayoutChangeEvent } from "react-native";
import { Colors } from "@/constants/Colors";

// Register extensions
echarts.use([TitleComponent, TooltipComponent, GridComponent, SkiaRenderer, PieChart, LegendComponent, BarChart]);

echarts.registerTheme("haresDark", {
  color: [
    "#dd6b66",
    "#759aa0",
    "#e69d87",
    "#8dc1a9",
    "#ea7e53",
    "#eedd78",
    "#73a373",
    "#73b9bc",
    "#7289ab",
    "#91ca8c",
    "#f49f42",
  ],
  backgroundColor: "transparent",
  textStyle: {
    color: Colors.dark.text,
  },
  title: {
    textStyle: {
      color: Colors.dark.text,
    },
    subtextStyle: {
      color: Colors.dark.text,
    },
  },
  line: {
    itemStyle: {
      borderWidth: 1,
    },
    lineStyle: {
      width: 2,
    },
    symbolSize: 4,
    symbol: "circle",
    smooth: false,
  },
  radar: {
    itemStyle: {
      borderWidth: 1,
    },
    lineStyle: {
      width: 2,
    },
    symbolSize: 4,
    symbol: "circle",
    smooth: false,
  },
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: "#ccc",
    },
  },
  pie: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  scatter: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  boxplot: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  parallel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  sankey: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  funnel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  gauge: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
  },
  candlestick: {
    itemStyle: {
      color: "#fd1050",
      color0: "#0cf49b",
      borderColor: "#fd1050",
      borderColor0: "#0cf49b",
      borderWidth: 1,
    },
  },
  graph: {
    itemStyle: {
      borderWidth: 0,
      borderColor: "#ccc",
    },
    lineStyle: {
      width: 1,
      color: "#aaaaaa",
    },
    symbolSize: 4,
    symbol: "circle",
    smooth: false,
    color: [
      "#dd6b66",
      "#759aa0",
      "#e69d87",
      "#8dc1a9",
      "#ea7e53",
      "#eedd78",
      "#73a373",
      "#73b9bc",
      "#7289ab",
      "#91ca8c",
      "#f49f42",
    ],
    label: {
      color: Colors.dark.text,
    },
  },
  map: {
    itemStyle: {
      areaColor: "#eee",
      borderColor: "#444",
      borderWidth: 0.5,
    },
    label: {
      color: Colors.dark.text,
    },
    emphasis: {
      itemStyle: {
        areaColor: "rgba(255,215,0,0.8)",
        borderColor: "#444",
        borderWidth: 1,
      },
      label: {
        color: "rgb(100,0,0)",
      },
    },
  },
  geo: {
    itemStyle: {
      areaColor: "#eee",
      borderColor: "#444",
      borderWidth: 0.5,
    },
    label: {
      color: "#000",
    },
    emphasis: {
      itemStyle: {
        areaColor: "rgba(255,215,0,0.8)",
        borderColor: "#444",
        borderWidth: 1,
      },
      label: {
        color: "rgb(100,0,0)",
      },
    },
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: Colors.dark.text,
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: Colors.dark.text,
      },
    },
    axisLabel: {
      show: true,
      color: Colors.dark.text,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ["#aaaaaa"],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ["#eeeeee"],
      },
    },
  },
  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: Colors.dark.text,
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: Colors.dark.text,
      },
    },
    axisLabel: {
      show: true,
      color: Colors.dark.text,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ["#aaaaaa"],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ["#eeeeee"],
      },
    },
  },
  logAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#eeeeee",
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: "#eeeeee",
      },
    },
    axisLabel: {
      show: true,
      color: "#eeeeee",
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ["#aaaaaa"],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ["#eeeeee"],
      },
    },
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#eeeeee",
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: "#eeeeee",
      },
    },
    axisLabel: {
      show: true,
      color: "#eeeeee",
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ["#aaaaaa"],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ["#eeeeee"],
      },
    },
  },
  toolbox: {
    iconStyle: {
      borderColor: "#999999",
    },
    emphasis: {
      iconStyle: {
        borderColor: "#666666",
      },
    },
  },
  legend: {
    textStyle: {
      color: Colors.dark.text,
    },
  },
  tooltip: {
    axisPointer: {
      lineStyle: {
        color: "#eeeeee",
        width: "1",
      },
      crossStyle: {
        color: "#eeeeee",
        width: "1",
      },
    },
  },
  timeline: {
    lineStyle: {
      color: "#eeeeee",
      width: 1,
    },
    itemStyle: {
      color: "#dd6b66",
      borderWidth: 1,
    },
    controlStyle: {
      color: "#eeeeee",
      borderColor: "#eeeeee",
      borderWidth: 0.5,
    },
    checkpointStyle: {
      color: "#e43c59",
      borderColor: "#c23531",
    },
    label: {
      color: "#eeeeee",
    },
    emphasis: {
      itemStyle: {
        color: "#a9334c",
      },
      controlStyle: {
        color: "#eeeeee",
        borderColor: "#eeeeee",
        borderWidth: 0.5,
      },
      label: {
        color: "#eeeeee",
      },
    },
  },
  visualMap: {
    color: ["#bf444c", "#d88273", "#f6efa6"],
  },
  dataZoom: {
    backgroundColor: "rgba(47,69,84,0)",
    dataBackgroundColor: "rgba(255,255,255,0.3)",
    fillerColor: "rgba(167,183,204,0.4)",
    handleColor: "#a7b7cc",
    handleSize: "100%",
    textStyle: {
      color: Colors.dark.text,
    },
  },
  markPoint: {
    label: {
      color: Colors.dark.text,
    },
    emphasis: {
      label: {
        color: Colors.dark.text,
      },
    },
  },
});

export function Chart({ option }: { option: echarts.EChartsCoreOption }) {
  const skiaRef = useRef(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const chartRef = useRef<any>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);
  const [chartHeight, setChartHeight] = useState<number>(0);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  //   useEffect(() => {
  //     Dimensions.addEventListener("change", handleDimensionsChange);
  //     return () => {
  //       Dimensions.removeEventListener("change", handleDimensionsChange);
  //     };
  //   }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let chart: echarts.ECharts;
    if (skiaRef.current) {
      chart = echarts.init(skiaRef.current, "haresDark", {
        renderer: "canvas",
        width: chartWidth,
        height: chartHeight,
      });
      chart.setOption(option);
      chartRef.current = chart;
    }
    return () => chart?.dispose();
  }, [option]);

  // watching for size changes, redraw the chart.
  useEffect(() => {
    chartRef.current?.resize({
      width: chartWidth,
      height: chartHeight,
    });
  }, [chartWidth, chartHeight]);

  // Get the width and height of the container
  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setChartWidth(width);
    setChartHeight(height);
  };

  // Screen orientation change event
  //   const handleDimensionsChange = (e) => {
  //     const { width, height } = e.screen;
  //     setChartWidth(width);
  //     setChartHeight(height);
  //   };

  return (
    <ThemedView onLayout={handleLayout}>
      <SkiaChart ref={skiaRef} />
    </ThemedView>
  );
}

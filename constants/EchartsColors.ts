import * as echarts from "echarts/core";
import { Colors } from "./Colors";
import { SkiaRenderer } from "@wuba/react-native-echarts";

import { BarChart, HeatmapChart, LineChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  VisualMapComponent,
  CalendarComponent,
} from "echarts/components";

// Register extensions
echarts.use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  SkiaRenderer,
  VisualMapComponent,
  HeatmapChart,
  CalendarComponent,
  PieChart,
  LegendComponent,
  LineChart,
  BarChart,
]);

echarts.registerTheme("haresDark", {
  color: [Colors.dark.tint],
  backgroundColor: "transparent",
  textStyle: {
    color: Colors.dark.text,
  },
  title: {
    textStyle: {
      color: Colors.dark.text,
      fontSize: 26,
    },
    subtextStyle: {
      color: Colors.dark.secondaryText,
    },
    left: "center",
  },

  grid: {
    left: 30,
    top: 20,
    right: 10,
    bottom: 20,
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
  calendar: {
    itemStyle: {
      borderWidth: 4,
      borderColor: Colors.dark.secondaryBackground,
      //   opacity: 0.7,
      color: "transparent",
      //   borderJoin: "round",
      //   borderRadius: 2,
    },
    splitLine: {
      show: false,
      lineStyle: {
        width: 2,
        color: Colors.dark.tint,
      },
    },
    yearLabel: {
      color: Colors.dark.text,
    },
    dayLabel: {
      color: Colors.dark.text,
    },
    monthLabel: {
      color: Colors.dark.text,
    },
  },
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: "#ccc",
    },

    label: {
      color: Colors.dark.text,
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
        color: Colors.dark.border,
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
        color: Colors.dark.border,
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
    pageIconColor: Colors.dark.text,
    pageTextStyle: {
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
    textStyle: {
      color: Colors.dark.text,
    },
    inRange: {
      color: ["#471d6e", "#8614cc", "#a43be2", "#92c156"],
      //   colors: [colors.spaceCadet, colors.frenchViolet, colors.pistachio],
      symbolSize: [30, 100],
    },
    outOfRange: {
      color: [Colors.dark.text],
      symbolSize: [30, 100],
    },
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

echarts.registerTheme("haresLight", {
  color: [Colors.light.tint],
  backgroundColor: "transparent",
  textStyle: {
    color: Colors.light.text,
  },
  title: {
    textStyle: {
      color: Colors.light.text,
      fontSize: 26,
    },
    subtextStyle: {
      color: Colors.light.secondaryText,
    },
    left: "center",
  },

  grid: {
    left: 30,
    top: 20,
    right: 10,
    bottom: 20,
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
  calendar: {
    itemStyle: {
      borderWidth: 4,
      borderColor: Colors.light.secondaryBackground,
      color: "transparent",
    },
    splitLine: {
      show: false,
      lineStyle: {
        width: 1,
        color: Colors.light.tint,
      },
    },
    yearLabel: {
      color: Colors.light.text,
    },
    dayLabel: {
      color: Colors.light.text,
    },
    monthLabel: {
      color: Colors.light.text,
    },
  },
  bar: {
    itemStyle: {
      barBorderWidth: 10,
      barBorderColor: "blue",
    },

    label: {
      color: Colors.light.text,
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
      color: Colors.light.text,
    },
  },
  map: {
    itemStyle: {
      areaColor: "#eee",
      borderColor: "#444",
      borderWidth: 0.5,
    },
    label: {
      color: Colors.light.text,
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
        color: Colors.light.text,
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: Colors.light.text,
      },
    },
    axisLabel: {
      show: true,
      color: Colors.light.text,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: Colors.light.border,
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
        color: Colors.light.text,
      },
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: Colors.light.text,
      },
    },
    axisLabel: {
      show: true,
      color: Colors.light.text,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: Colors.light.border,
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
      color: Colors.light.text,
    },
    pageIconColor: Colors.light.text,
    pageTextStyle: {
      color: Colors.light.text,
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
    textStyle: {
      color: Colors.light.text,
    },
    inRange: {
      color: ["#471d6e", "#8614cc", "#a43be2", "#92c156"],
      //   colors: [colors.spaceCadet, colors.frenchViolet, colors.pistachio],
      symbolSize: [30, 100],
    },
    outOfRange: {
      color: ["#cdcdd5"],
      symbolSize: [30, 100],
    },
  },
  dataZoom: {
    backgroundColor: "rgba(47,69,84,0)",
    dataBackgroundColor: "rgba(255,255,255,0.3)",
    fillerColor: "rgba(167,183,204,0.4)",
    handleColor: "#a7b7cc",
    handleSize: "100%",
    textStyle: {
      color: Colors.light.text,
    },
  },
  markPoint: {
    label: {
      color: Colors.light.text,
    },
    emphasis: {
      label: {
        color: Colors.light.text,
      },
    },
  },
});

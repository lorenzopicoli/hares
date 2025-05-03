import type { Tracker } from "@/db/schema";
import type { EChartsCoreOption } from "echarts";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Chart } from "./Chart";
import { GroupFunction } from "@/utils/groupFunctions";
import { useNumberTrackerLineStats } from "@/hooks/data/stats/useNumberTrackerLineStats";
import { addDays, format } from "date-fns";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ChartCard from "../ChartCard";
import type { StatsDateRange } from "../BottomSheets/StatsScreenOptionsBottomSheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useColors, type ThemedColors } from "../ThemeProvider";
import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { NumberChartOptionsBottomSheet } from "../BottomSheets/NumberChartOptionsBottomSheet";
import { DateGroupingPeriod } from "@/utils/dateGroupPeriod";

export function CalendarHeatmapChart(props: {
  tracker: Tracker;
  dateRange: StatsDateRange;
}) {
  const { tracker, dateRange } = props;

  const optionsBottomSheet = useRef<BottomSheetModal>(null);
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();

  const [groupFun, setGroupFun] = useState(GroupFunction.avg);

  const { entriesNumberValueStats } = useNumberTrackerLineStats({
    trackerId: tracker.id,
    groupPeriod: DateGroupingPeriod.daily,
    groupFun,
    dateRange,
  });
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
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
        // If no value, we just have to set something out of range so the coloring is correct
        value: [date, dayData?.value ?? Number.MAX_SAFE_INTEGER],
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
        itemGap: 5,
        text: [`   ${String(chartData.max ?? 0)}`, `${String(Math.max(chartData.min ?? 0, 0))}     `],
        left: "center",
      },
      calendar: {
        left: 50,
        right: 30,
        cellSize: ["auto", 18],
        range: [format(dateRange.startDate, "yyyy-MM-dd"), format(dateRange.endDate, "yyyy-MM-dd")],
        yearLabel: { show: false },
        dayLabel: {
          firstDay: 1, // start on Monday
        },
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

  // For some reason the chart doesn't render properly on first render, but forcing a re-render fixes it
  useEffect(() => {
    const timer = setTimeout(() => {
      forceUpdate();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleFilterPress = () => {
    optionsBottomSheet.current?.present();
  };

  return (
    <ChartCard
      title="Daily values"
      right={
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <MaterialCommunityIcons name="filter-menu" size={20} color={colors.text} />
        </TouchableOpacity>
      }
      onFilterPress={handleFilterPress}
    >
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
      <NumberChartOptionsBottomSheet ref={optionsBottomSheet} groupFun={groupFun} onChangeGroupFun={setGroupFun} />
    </ChartCard>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    filterButton: {
      backgroundColor: theme.toggleButton.background,
      height: 35,
      width: 35,
      borderRadius: Sizes.radius.small,
      alignItems: "center",
      justifyContent: "center",
    },
  });

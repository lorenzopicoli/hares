import type { Tracker } from "@/db/schema";
import type { EChartsCoreOption } from "echarts";
import { useMemo, useRef, useState } from "react";
import { Chart } from "./Chart";
import { useTopTextListStats } from "@/hooks/data/stats/useTopTextListStats";
import { Sizes } from "@/constants/Sizes";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import ChartCard from "../ChartCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useColors, type ThemedColors } from "../ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { RankingChartOptionsBottomSheet } from "../BottomSheets/RankingChartOptionsBottomSheet";
import type { StatsDateRange } from "../BottomSheets/StatsScreenOptionsBottomSheet";

interface Props {
  tracker: Tracker;
  dateRange: StatsDateRange;
}

export default function TextListBarChart(props: Props) {
  const { tracker, dateRange } = props;
  const optionsBottomSheet = useRef<BottomSheetModal>(null);
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();

  const [limit, setLimit] = useState(10);

  const { textListUsageCount } = useTopTextListStats({
    trackerId: tracker.id,
    limit: limit ?? 10,
    includeOthers: false,
    dateRange,
  });
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
          color: colors.darkTint,
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

  const handleFilterPress = () => {
    optionsBottomSheet.current?.present();
  };

  return (
    <ChartCard
      title={"Ranking"}
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
          padding: Sizes.medium,
          marginLeft: 40,
          marginRight: 40,
          height: 300,
        }}
      >
        <Chart option={option} />
      </View>
      <RankingChartOptionsBottomSheet ref={optionsBottomSheet} limit={limit} onChangeLimit={setLimit} />
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

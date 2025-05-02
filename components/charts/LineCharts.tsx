import type { Tracker } from "@/db/schema";
import { useEntryCountStats } from "@/hooks/data/stats/useEntryCountStats";
import type { EChartsCoreOption } from "echarts";
import { useMemo, useRef, useState } from "react";
import { Chart } from "./Chart";
import { DateGroupingPeriod } from "@/utils/dateGroupPeriod";
import { useNumberTrackerLineStats } from "@/hooks/data/stats/useNumberTrackerLineStats";
import { GroupFunction } from "@/utils/groupFunctions";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Sizes } from "@/constants/Sizes";
import type { StatsDateRange } from "../BottomSheets/StatsScreenOptionsBottomSheet";
import ChartCard from "../ChartCard";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColors, type ThemedColors } from "../ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { NumberChartOptionsBottomSheet } from "../BottomSheets/NumberChartOptionsBottomSheet";

export function EntryCountLineChart(props: {
  tracker: Tracker;
  dateRange: StatsDateRange;
}) {
  const { tracker, dateRange } = props;
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();
  const [groupPeriod, setGroupPeriod] = useState(DateGroupingPeriod.daily);
  const { entryCountStats } = useEntryCountStats({ trackerId: tracker.id, groupPeriod, dateRange });
  const optionsBottomSheet = useRef<BottomSheetModal>(null);

  const option: EChartsCoreOption = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        data: entryCountStats.map((t) => t.date),
      },
      yAxis: {},
      series: [
        {
          smooth: true,
          data: entryCountStats.map((t) => t.value),
          type: "line",
          name: "No. of entries",
        },
      ],
    }),
    [entryCountStats],
  );

  const handleFilterPress = () => {
    optionsBottomSheet.current?.present();
  };

  return (
    <ChartCard
      title="Frequency"
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
      <NumberChartOptionsBottomSheet
        ref={optionsBottomSheet}
        groupPeriod={groupPeriod}
        onChangeGroupPeriod={setGroupPeriod}
      />
    </ChartCard>
  );
}

export function NumberTrackersLineChart(props: {
  tracker: Tracker;
  dateRange: StatsDateRange;
}) {
  const { tracker, dateRange } = props;
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();
  const [groupPeriod, setGroupPeriod] = useState(DateGroupingPeriod.daily);
  const [groupFun, setGroupFun] = useState(GroupFunction.avg);
  const { entriesNumberValueStats } = useNumberTrackerLineStats({
    trackerId: tracker.id,
    groupPeriod,
    groupFun,
    dateRange,
  });
  const optionsBottomSheet = useRef<BottomSheetModal>(null);
  const option: EChartsCoreOption = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        data: entriesNumberValueStats.map((t) => t.date),
      },
      yAxis: {},
      series: [
        {
          smooth: true,
          data: entriesNumberValueStats.map((t) => t.value),
          type: "line",
          name: "Value",
        },
      ],
    }),
    [entriesNumberValueStats],
  );

  const handleFilterPress = () => {
    optionsBottomSheet.current?.present();
  };

  return (
    <ChartCard
      title="Values"
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
      <NumberChartOptionsBottomSheet
        ref={optionsBottomSheet}
        groupPeriod={groupPeriod}
        onChangeGroupPeriod={setGroupPeriod}
        groupFun={groupFun}
        onChangeGroupFun={setGroupFun}
      />
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

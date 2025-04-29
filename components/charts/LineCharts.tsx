import type { Tracker } from "@/db/schema";
import { useEntryCountStats } from "@/hooks/data/stats/useEntryCountStats";
import type { EChartsCoreOption } from "echarts";
import { useMemo } from "react";
import { Chart } from "./Chart";
import type { DateGroupingPeriod } from "@/utils/dateGroupPeriod";
import { useNumberTrackerLineStats } from "@/hooks/data/stats/useNumberTrackerLineStats";
import type { GroupFunction } from "@/utils/groupFunctions";
import { View } from "react-native";
import { Sizes } from "@/constants/Sizes";

export function EntryCountLineChart(props: {
  tracker: Tracker;
  groupPeriod: DateGroupingPeriod;
}) {
  const { tracker, groupPeriod } = props;
  const { entryCountStats } = useEntryCountStats({ trackerId: tracker.id, groupPeriod });

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

export function NumberTrackersLineChart(props: {
  tracker: Tracker;
  groupPeriod: DateGroupingPeriod;
  groupFun: GroupFunction;
}) {
  const { tracker, groupPeriod, groupFun } = props;
  const { entriesNumberValueStats } = useNumberTrackerLineStats({ trackerId: tracker.id, groupPeriod, groupFun });
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

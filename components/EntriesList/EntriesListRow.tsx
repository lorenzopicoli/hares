import { StyleSheet, TouchableOpacity, View, type StyleProp, type ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import type { ThemedColors } from "../ThemeProvider";
import type { TrackerEntry } from "@/db/schema";
import useStyles from "@/hooks/useStyles";
import { useMemo } from "react";
import { isDefined } from "@/utils/isDefined";
import { Sizes } from "@/constants/Sizes";
import { formatDate, formatEntryDate } from "@/utils/entryDate";

export interface EntriesListRowProps {
  entry: TrackerEntry;
  onPress?: (entryId: number) => void;
  style?: StyleProp<ViewStyle>;
  hideTrackerName?: boolean;
}

export default function EntriesListRow(props: EntriesListRowProps) {
  const { entry, style, hideTrackerName } = props;
  const { styles } = useStyles(createStyles);

  const value = useMemo(() => {
    let v = "-";
    if (isDefined(entry.numberValue)) {
      v = entry.numberValue.toString();
    }

    if (isDefined(entry.booleanValue)) {
      v = entry.booleanValue ? "Yes" : "No";
    }

    if (isDefined(entry.textListValues) && entry.textListValues.length > 0) {
      v = entry.textListValues.map((v) => v.name).join(", ");
    }

    v = entry.tracker?.prefix ? `${entry.tracker.prefix} ${v}` : v;
    v = entry.tracker?.suffix ? `${v} ${entry.tracker.suffix}` : v;

    return v;
  }, [entry]);

  const handlePress = () => props.onPress?.(entry.id);

  return (
    <TouchableOpacity disabled={!props.onPress} onPress={handlePress}>
      <View style={[styles.container, style]}>
        {entry.tracker?.name && !hideTrackerName ? (
          <ThemedText style={styles.title}>{entry.tracker.name}</ThemedText>
        ) : null}

        <View style={styles.innerContainer}>
          <ThemedText style={styles.mainText}>
            <ThemedText style={styles.secondary}>Value: </ThemedText> {value}
          </ThemedText>
          <ThemedText style={styles.mainText}>
            <ThemedText style={styles.secondary}>Date: </ThemedText> {formatEntryDate(entry)}
          </ThemedText>
          {entry.comment ? (
            <ThemedText style={styles.mainText}>
              <ThemedText style={styles.secondary}>Comments: </ThemedText> {entry.comment}
            </ThemedText>
          ) : null}
          {entry.createdAt ? (
            <ThemedText style={styles.secondary}>Logged on: {formatDate(entry.createdAt)}</ThemedText>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      paddingBottom: Sizes.medium,
      flexDirection: "column",
      gap: Sizes.large,
      minHeight: Sizes.list.large,
    },
    innerContainer: {
      gap: Sizes.small,
    },
    mainText: {},
    valueText: {
      flex: 1,
      textAlign: "right",
    },
    secondary: {
      color: theme.secondaryText,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
  });

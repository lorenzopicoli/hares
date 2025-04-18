import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Separator } from "../Separator";
import { ThemedText } from "../ThemedText";
import type { ThemedColors } from "../ThemeProvider";
import type { TrackerEntry } from "@/db/schema";
import useStyles from "@/hooks/useStyles";
import { useMemo } from "react";
import { isDefined } from "@/utils/isDefined";
import { Sizes } from "@/constants/Sizes";
import { formatEntryDate } from "@/utils/entryDate";

export interface EntriesListRowProps {
  entry: TrackerEntry;
  onPress?: (entry: TrackerEntry) => void;
}

export default function EntriesListRow(props: EntriesListRowProps) {
  const { entry } = props;
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

  const handlePress = () => props.onPress?.(entry);

  return (
    <TouchableOpacity disabled={!props.onPress} onPress={handlePress}>
      <View style={styles.container}>
        {entry.tracker?.name ? <ThemedText type="subtitle">{entry.tracker.name}</ThemedText> : null}

        <View style={styles.innerContainer}>
          <ThemedText style={styles.mainText}>
            <ThemedText style={styles.secondary}>Value: </ThemedText> {value}
          </ThemedText>
          <ThemedText style={styles.mainText}>
            <ThemedText style={styles.secondary}>Date: </ThemedText> {formatEntryDate(entry)}
          </ThemedText>
          {entry.createdAt ? (
            <ThemedText style={styles.secondary}>Logged on: {formatEntryDate(entry)}</ThemedText>
          ) : null}
        </View>
      </View>
      <Separator />
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      padding: Sizes.medium,
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
  });

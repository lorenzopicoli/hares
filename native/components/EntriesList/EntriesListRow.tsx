import { format } from "date-fns";
import { StyleSheet, View } from "react-native";
import { Separator } from "../Separator";
import { ThemedText } from "../ThemedText";
import type { ThemedColors } from "../ThemeProvider";
import type { TrackerEntry } from "@/db/schema";
import useStyles from "@/hooks/useStyles";

export interface EntriesListRowProps {
  entry: TrackerEntry;
}

export default function EntriesListRow(props: EntriesListRowProps) {
  const { entry } = props;
  const { styles } = useStyles(createStyles);
  return (
    <View key={entry.id}>
      <View style={styles.container}>
        <ThemedText>{entry.date ? format(entry.date, "MMMM do, yyyy H:mma") : entry.periodOfDay}</ThemedText>
        <ThemedText>10</ThemedText>
      </View>
      <Separator />
    </View>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });

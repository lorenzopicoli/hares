import { Separator } from "@/components/Separator";
import { YStack } from "@/components/Stacks";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedView";
import type { ThemedColors } from "@/components/ThemeProvider";
import { Sizes } from "@/constants/Sizes";
import type { ExportLog } from "@/db/schema";
import { useExportLogs } from "@/hooks/data/useExportLogs";
import useStyles from "@/hooks/useStyles";
import { StyleSheet, FlatList, Platform, View } from "react-native";

export default function ExportLogsScreen() {
  const { styles } = useStyles(createStyles);

  const { exportLogs } = useExportLogs();

  const renderItem = ({ item }: { item: ExportLog }) => {
    return (
      <YStack style={styles.itemInnerContainer} flexWrap="wrap">
        <View>
          <ThemedText>
            <ThemedText style={styles.bold}>Started (UTC): </ThemedText>
            {item.createdAt?.toISOString()}
          </ThemedText>
        </View>
        <View>
          <ThemedText>
            <ThemedText style={styles.bold}>Finished (UTC): </ThemedText>
            {item.finishedAt?.toISOString()}
          </ThemedText>
        </View>
        <View>
          <ThemedText>
            <ThemedText style={styles.bold}>Destination: </ThemedText>
            {decodeURIComponent(item.destinationFolder ?? "")}
          </ThemedText>
        </View>
      </YStack>
    );
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <FlatList
        data={exportLogs}
        renderItem={renderItem}
        keyboardShouldPersistTaps={Platform.OS === "android" ? "always" : undefined}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={Separator}
      />
    </ThemedSafeAreaView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: Sizes.small,
    },
    itemInnerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      //   height: Sizes.list.medium,
      padding: Sizes.medium,
    },
    bold: {
      fontWeight: 700,
    },
  });

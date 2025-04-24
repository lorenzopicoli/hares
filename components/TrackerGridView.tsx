import type { Tracker } from "@/db/schema";
import { useTrackers } from "@/hooks/data/useTrackers";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { HapticPressable } from "./HapticPressable";
import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import type { ThemedColors } from "./ThemeProvider";
import { ThemedView } from "./ThemedView";

interface Props {
  searchQuery?: string;
  collectionId?: number;
  onSelectTracker?: (tracker: Tracker) => void;
  onLongPressTracker?: (tracker: Tracker) => void;
}

function TrackerGridView(props: Props) {
  const { collectionId, searchQuery, onSelectTracker, onLongPressTracker } = props;
  const { trackers } = useTrackers({ collectionId, searchQuery });
  const { styles } = useStyles(createStyles);

  const renderItem = ({ item: tracker }: { item: Tracker }) => {
    return (
      <View style={styles.gridItem}>
        <HapticPressable
          style={styles.card}
          onLongPress={() => onLongPressTracker?.(tracker)}
          onPress={() => onSelectTracker?.(tracker)}
        >
          <Text style={styles.cardText}>{tracker.name}</Text>
        </HapticPressable>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={trackers}
        renderItem={renderItem}
        keyboardShouldPersistTaps={Platform.OS === "android" ? "always" : undefined}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
    </ThemedView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      padding: Sizes.xSmall,
    },
    gridItem: {
      flex: 1,
      padding: Sizes.xSmall,
    },
    card: {
      backgroundColor: theme.toggleButton.background,
      borderRadius: Sizes.radius.small,
      padding: Sizes.medium,
      minHeight: 100,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.toggleButton.border,
    },
    cardText: {
      color: theme.text,
      fontSize: Sizes.font.larger,
      textAlign: "center",
    },
  });

export default React.memo(TrackerGridView);

import type { Tracker } from "@/db/schema";
import { useTrackers } from "@/hooks/data/useTrackers";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { HapticPressable } from "./HapticPressable";
import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { useColors, type ThemedColors } from "./ThemeProvider";
import { ThemedView } from "./ThemedView";
import { useSettings } from "./SettingsProvieder";
import EmptyState from "./EmptyState";
import { ThemedText } from "./ThemedText";
import { Entypo } from "@expo/vector-icons";

interface Props {
  searchQuery?: string;
  collectionId?: number;
  onSelectTracker?: (tracker: Tracker) => void;
  onLongPressTracker?: (tracker: Tracker) => void;
}

function TrackerGridView(props: Props) {
  const { collectionId, searchQuery, onSelectTracker, onLongPressTracker } = props;
  const { trackers } = useTrackers({ collectionId, searchQuery });
  const { colors } = useColors();
  const { styles } = useStyles(createStyles);
  const { settings } = useSettings();

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
      {trackers.length ? (
        <FlatList
          key={`track-grid-${settings.trackersGridColsNumber}`}
          data={trackers}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={Platform.OS === "android" ? "always" : undefined}
          keyExtractor={(item) => item.id.toString()}
          numColumns={settings.trackersGridColsNumber}
        />
      ) : (
        <ThemedView style={styles.emptyStateContainer}>
          <EmptyState
            title="No trackers yet"
            subTitle={
              <ThemedText style={styles.emptyStateSubtitle}>
                Add a tracker by opening the top-right menu (
                <Entypo name="dots-three-vertical" size={16} color={colors.text} />)
              </ThemedText>
            }
          />
        </ThemedView>
      )}
    </ThemedView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      paddingRight: Sizes.xSmall,
      paddingLeft: Sizes.xSmall,
    },
    emptyStateContainer: {
      flex: 1,
    },
    emptyStateSubtitle: {
      fontSize: 18,
      textAlign: "center",
      color: theme.secondaryText,
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

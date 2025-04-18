import type { Tracker } from "@/db/schema";
import { useTrackers } from "@/hooks/data/useTrackers";
import { DndProvider, DraggableGrid } from "@mgcrea/react-native-dnd";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { HapticPressable } from "./HapticPressable";
import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import type { ThemedColors } from "./ThemeProvider";

interface Props {
  searchQuery?: string;
  collectionId?: number;
  onSelectTracker?: (tracker: Tracker) => void;
}

function TrackerGridView(props: Props) {
  const { collectionId, searchQuery, onSelectTracker } = props;
  const { trackers } = useTrackers({ collectionId, searchQuery });
  const { styles } = useStyles(createStyles);

  return (
    <DndProvider activationDelay={200}>
      <Animated.ScrollView>
        <DraggableGrid direction="row" size={2} style={styles.gridContainer}>
          {trackers.map((tracker) => (
            // Initially you could reorder trackers in this screen, but I had so many problems with draggable grids that I gave up
            // Should either refactor this to something more performant or find something that actually works on drag
            //   <Draggable key={item.id} id={String(item.id)} style={styles.gridItem}>
            //     {renderGridElement(item)}
            //   </Draggable>
            <View key={tracker.id} style={styles.gridItem}>
              <HapticPressable style={styles.card} onPress={() => onSelectTracker?.(tracker)}>
                <Text style={styles.cardText}>{tracker.name}</Text>
              </HapticPressable>
            </View>
          ))}
        </DraggableGrid>
      </Animated.ScrollView>
    </DndProvider>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingRight: Sizes.small,
    },
    gridItem: {
      width: "50%",
      paddingTop: Sizes.small,
      paddingLeft: Sizes.small,
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

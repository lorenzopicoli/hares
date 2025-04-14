import { useDatabase } from "@/contexts/DatabaseContext";
import { collectionsTrackersTable, trackersTable, type Tracker } from "@/db/schema";
import {
  DndProvider,
  Draggable,
  DraggableGrid,
  type DndProviderProps,
  type DraggableGridProps,
} from "@mgcrea/react-native-dnd";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

interface Props {
  collectionId?: number;
  isReordering: boolean;
  horizontalPadding?: boolean;
  onSelectTracker?: (tracker: Tracker) => void;
}

export default function TrackerGridView(props: Props) {
  const { db } = useDatabase();
  const { collectionId, isReordering, horizontalPadding = true, onSelectTracker } = props;
  const { data: allTrackers } = useLiveQuery(db.select().from(trackersTable).orderBy(trackersTable.index));
  const { data: collectionTrackers } = useLiveQuery(
    db
      .select()
      .from(trackersTable)
      .innerJoin(collectionsTrackersTable, eq(collectionsTrackersTable.trackerId, trackersTable.id))
      .orderBy(collectionsTrackersTable.index),
  );

  const trackers = useMemo(
    () => (collectionId ? collectionTrackers.map((ct) => ct.trackers) : allTrackers),
    [collectionId, collectionTrackers, allTrackers],
  );
  const handleDragEnd: DndProviderProps["onDragEnd"] = ({ active, over }) => {
    "worklet";
    if (over) {
      console.log("onDragEnd", { active, over });
    }
  };

  const handleBegin: DndProviderProps["onBegin"] = () => {
    "worklet";
    console.log("onBegin");
  };

  const handleFinalize: DndProviderProps["onFinalize"] = ({ state }) => {
    "worklet";
    if (state !== State.FAILED) {
      console.log("onFinalize");
    }
  };
  const onGridOrderChange: DraggableGridProps["onOrderChange"] = async (value) => {
    console.log("On Grid Order change");
  };

  const renderGridElement = (tracker: Tracker) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => onSelectTracker?.(tracker)} activeOpacity={0.7}>
        <Text style={styles.cardText}>{tracker.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <DndProvider onBegin={handleBegin} onFinalize={handleFinalize} onDragEnd={handleDragEnd} activationDelay={200}>
      <Animated.ScrollView>
        <DraggableGrid
          direction="row"
          size={2}
          style={{ ...styles.gridContainer, ...(horizontalPadding ? {} : styles.noHorizontalPadding) }}
          onOrderChange={onGridOrderChange}
        >
          {trackers.map((item) =>
            isReordering ? (
              // Changing screens with draggable elements seems to cause touches to not be registered in the destination screen
              // I don't know why it happens and it's intermittent
              <Draggable key={item.id} id={String(item.id)} style={styles.gridItem}>
                {renderGridElement(item)}
              </Draggable>
            ) : (
              <View key={item.id} id={String(item.id)} style={styles.gridItem}>
                {renderGridElement(item)}
              </View>
            ),
          )}
        </DraggableGrid>
      </Animated.ScrollView>
    </DndProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  noHorizontalPadding: {
    marginHorizontal: -8,
  },
  gridItem: {
    width: "50%",
    padding: 8,
  },
  card: {
    backgroundColor: "#25262B",
    borderRadius: 8,
    padding: 16,
    minHeight: 100,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2C2E33",
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

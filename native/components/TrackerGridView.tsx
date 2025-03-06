import type { Tracker } from "@/models/tracker";
import {
  DndProvider,
  Draggable,
  DraggableGrid,
  type DndProviderProps,
  type DraggableGridProps,
} from "@mgcrea/react-native-dnd";
import { StyleSheet, ScrollView, TouchableOpacity, Text, View } from "react-native";
import { State } from "react-native-gesture-handler";

export default function TrackerGridView({ trackers, isReordering }: { trackers: Tracker[]; isReordering: boolean }) {
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
    console.log("onFinalize");
    if (state !== State.FAILED) {
      console.log("onFinalize");
    }
  };
  const onGridOrderChange: DraggableGridProps["onOrderChange"] = async (value) => {
    console.log("On Grid Order change");
  };

  const renderGridElement = (tracker: Tracker) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => console.log("selected")} activeOpacity={0.7}>
        <Text style={styles.cardText}>{tracker.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <DndProvider onBegin={handleBegin} onFinalize={handleFinalize} onDragEnd={handleDragEnd} activationDelay={200}>
        <DraggableGrid direction="row" size={2} style={styles.gridContainer} onOrderChange={onGridOrderChange}>
          {trackers.map((item) =>
            isReordering ? (
              // Changing screens with draggable elements seems to cause touches to not be registered in the destination screen
              // I don't know why it happens and it's intermittent
              <Draggable key={item.id} id={item.id} style={styles.gridItem}>
                {renderGridElement(item)}
              </Draggable>
            ) : (
              <View key={item.id} id={item.id} style={styles.gridItem}>
                {renderGridElement(item)}
              </View>
            ),
          )}
        </DraggableGrid>
      </DndProvider>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
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

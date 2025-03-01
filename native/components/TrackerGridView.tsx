import type { Tracker } from "@/models/tracker";
import {
  DndProvider,
  DraggableGrid,
  Draggable,
  type DndProviderProps,
  type DraggableGridProps,
} from "@mgcrea/react-native-dnd";
import { StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import { State } from "react-native-gesture-handler";

export default function TrackerGridView({ trackers }: { trackers: Tracker[] }) {
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

  return (
    <ScrollView style={styles.container}>
      <DndProvider onBegin={handleBegin} onFinalize={handleFinalize} onDragEnd={handleDragEnd} activationDelay={200}>
        <DraggableGrid direction="row" size={2} style={styles.gridContainer} onOrderChange={onGridOrderChange}>
          {trackers.map((item) => (
            <Draggable key={item.id} id={item.id} style={styles.gridItem}>
              <TouchableOpacity style={styles.card} onPress={() => console.log("selected")} activeOpacity={0.7}>
                <Text style={styles.cardText}>{item.name}</Text>
              </TouchableOpacity>
            </Draggable>
          ))}
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

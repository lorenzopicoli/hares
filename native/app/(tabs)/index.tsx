import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView } from "react-native";
import {
  DndProvider,
  Draggable,
  DraggableGrid,
  Droppable,
  type DndProviderProps,
  type DraggableGridProps,
} from "@mgcrea/react-native-dnd";
import { Ionicons } from "@expo/vector-icons";
import { TabBar, type Route, type NavigationState, type SceneRendererProps } from "react-native-tab-view";
import { GestureHandlerRootView, State } from "react-native-gesture-handler";

import { StyleSheet } from "react-native";

interface Tracker {
  _id: string;
  question: string;
  type: "number" | "scale" | "boolean" | "text_list";
}

interface Collection {
  _id: string;
  name: string;
  trackers: Tracker[];
}

// Mock data
const mockTrackers: Tracker[] = [
  { _id: "1", question: "How many glasses of water?", type: "number" },
  { _id: "2", question: "How was your mood today?", type: "scale" },
  { _id: "3", question: "Did you exercise?", type: "boolean" },
  { _id: "4", question: "What did you eat?", type: "text_list" },
];

const mockCollections: Collection[] = [
  { _id: "all", name: "All", trackers: mockTrackers },
  {
    _id: "health",
    name: "Daily Health",
    trackers: mockTrackers.slice(0, 2),
  },
  {
    _id: "fitness",
    name: "Fitness",
    trackers: mockTrackers.slice(2),
  },
];

interface TrackerCardProps {
  tracker: Tracker;
  onPress: () => void;
}

const TrackerCard = ({ tracker, onPress }: TrackerCardProps) => {
  return (
    <Draggable id={tracker._id}>
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.cardText}>{tracker.question}</Text>
      </TouchableOpacity>
    </Draggable>
  );
};

interface TrackerGridProps {
  trackers: Tracker[];
  onSelectTracker: (tracker: Tracker) => void;
  onReorder: (newOrder: Tracker[]) => void;
}

const TrackerGrid = ({ trackers, onSelectTracker, onReorder }: TrackerGridProps) => {
  //   const handleDragEnd = ({ active, over }) => {
  //     "worklet";
  //     if (over) {
  //       const activeIndex = trackers.findIndex((t) => t._id === active.id);
  //       const overIndex = trackers.findIndex((t) => t._id === over.id);
  //       if (activeIndex !== -1 && overIndex !== -1) {
  //         const newTrackers = [...trackers];
  //         const [removed] = newTrackers.splice(activeIndex, 1);
  //         newTrackers.splice(overIndex, 0, removed);
  //         onReorder(newTrackers);
  //       }
  //     }
  //   };

  return (
    <View style={styles.gridContainer}>
      {trackers.map((tracker, index) => (
        <Droppable key={tracker._id} id={tracker._id} style={styles.gridItem}>
          <TrackerCard tracker={tracker} onPress={() => onSelectTracker(tracker)} />
        </Droppable>
      ))}
    </View>
  );
};

type TabRoute = Route & {
  key: string;
  title: string;
};

export const CollectionsView = () => {
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTracker, setSelectedTracker] = useState<Tracker | null>(null);
  const [addNewModalVisible, setAddNewModalVisible] = useState(false);
  const [collections, setCollections] = useState(mockCollections);

  const [routes] = useState<TabRoute[]>(
    collections.map((collection) => ({
      key: collection._id,
      title: collection.name,
    })),
  );

  const handleReorder = (collectionId: string, newTrackers: Tracker[]) => {
    setCollections((prev) =>
      prev.map((collection) =>
        collection._id === collectionId ? { ...collection, trackers: newTrackers } : collection,
      ),
    );
  };

  const renderScene = ({ route }: SceneRendererProps & { route: TabRoute }) => {
    const collection = collections.find((c) => c._id === route.key);
    if (!collection) return null;

    const filteredTrackers = collection.trackers.filter((tracker) =>
      tracker.question.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
      <ScrollView style={styles.sceneContainer}>
        <DndProvider
          onDragEnd={({ active, over }) => {
            if (active && over) {
              const activeIndex = filteredTrackers.findIndex((t) => t._id === active.id);
              const overIndex = filteredTrackers.findIndex((t) => t._id === over.id);
              if (activeIndex !== -1 && overIndex !== -1) {
                const newTrackers = [...filteredTrackers];
                const [removed] = newTrackers.splice(activeIndex, 1);
                newTrackers.splice(overIndex, 0, removed);
                handleReorder(collection._id, newTrackers);
              }
            }
          }}
        >
          <TrackerGrid
            trackers={filteredTrackers}
            onSelectTracker={setSelectedTracker}
            onReorder={(newTrackers) => handleReorder(collection._id, newTrackers)}
          />
        </DndProvider>
      </ScrollView>
    );
  };

  const renderTabBar = (props: SceneRendererProps & { navigationState: NavigationState<TabRoute> }) => (
    <TabBar
      {...props}
      style={styles.tabBar}
      indicatorStyle={styles.indicator}
      //   labelStyle={styles.tabLabel}
      scrollEnabled
    />
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
    console.log("onFinalize");
    if (state !== State.FAILED) {
      console.log("onFinalize");
    }
  };
  const onGridOrderChange: DraggableGridProps["onOrderChange"] = (value) => {
    console.log("onGridOrderChange", value);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchClear} onPress={() => setSearchQuery("")}>
            {searchQuery ? (
              <Ionicons name="close-circle" size={20} color="#666" />
            ) : (
              <Ionicons name="search" size={20} color="#666" />
            )}
          </TouchableOpacity>
        </View>

        {/* <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
          initialLayout={{ width: Dimensions.get("window").width }}
        /> */}
        <DndProvider onBegin={handleBegin} onFinalize={handleFinalize} onDragEnd={handleDragEnd} activationDelay={200}>
          <DraggableGrid direction="row" size={2} style={styles.gridContainer} onOrderChange={onGridOrderChange}>
            {mockTrackers.map((item) => (
              <Draggable key={item._id} id={item._id} style={styles.gridItem}>
                <TouchableOpacity style={styles.card} onPress={() => console.log("selected")} activeOpacity={0.7}>
                  <Text style={styles.cardText}>{item.question}</Text>
                </TouchableOpacity>
              </Draggable>
            ))}
          </DraggableGrid>
        </DndProvider>

        <TouchableOpacity style={styles.fab} onPress={() => setAddNewModalVisible(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        <Modal
          visible={addNewModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAddNewModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setAddNewModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={!!selectedTracker}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedTracker(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedTracker?.question}</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedTracker(null)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1B1E",
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
  searchContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#25262B",
    borderRadius: 8,
    paddingHorizontal: 16,
    color: "#fff",
  },
  searchClear: {
    position: "absolute",
    right: 24,
    top: 24,
  },
  sceneContainer: {
    flex: 1,
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
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7B2EDA",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tabBar: {
    backgroundColor: "#1A1B1E",
  },
  indicator: {
    backgroundColor: "#7B2EDA",
  },
  tabLabel: {
    color: "#fff",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1A1B1E",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    minHeight: "50%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalCloseButton: {
    alignSelf: "flex-end",
    padding: 8,
  },
  modalCloseText: {
    color: "#7B2EDA",
    fontSize: 16,
  },
  box: {
    margin: 24,
    padding: 24,
    height: 128,
    width: 128,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "darkseagreen",
  },
});

export default CollectionsView;

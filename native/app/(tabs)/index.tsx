import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { type NavigationState, type Route, type SceneRendererProps, TabBar, TabView } from "react-native-tab-view";
import { Ionicons } from "@expo/vector-icons";
import type { Tracker, Collection } from "@/models/tracker";
import TrackerGridView from "@/components/TrackerGridView";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type TabRoute = Route & {
  key: string;
  title: string;
};

const mockTrackers: Tracker[] = [
  { id: "1", name: "How many glasses of water?", type: "number" },
  { id: "2", name: "How was your mood today?", type: "scale" },
  { id: "3", name: "Did you exercise?", type: "boolean" },
  { id: "4", name: "What did you eat?", type: "text_list" },
  { id: "5", name: "How many glasses of water?", type: "number" },
  { id: "6", name: "How was your mood today?", type: "scale" },
  { id: "7", name: "Did you exercise?", type: "boolean" },
  { id: "8", name: "What did you eat?", type: "text_list" },
  { id: "9", name: "How many glasses of water?", type: "number" },
  { id: "10", name: "How was your mood today?", type: "scale" },
  { id: "11", name: "Did you exercise?", type: "boolean" },
  { id: "12", name: "What did you eat?", type: "text_list" },
  { id: "13", name: "How many glasses of water?", type: "number" },
  { id: "14", name: "How was your mood today?", type: "scale" },
  { id: "15", name: "Did you exercise?", type: "boolean" },
  { id: "16", name: "What did you eat?", type: "text_list" },
];

const mockCollections: Collection[] = [
  { id: "all", name: "All", trackers: mockTrackers },
  {
    id: "health",
    name: "Daily Health",
    trackers: mockTrackers.slice(0, 2),
  },
  {
    id: "fitness",
    name: "Fitness",
    trackers: mockTrackers.slice(2),
  },
];

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [collections, setCollections] = useState(mockCollections);

  const [routes] = useState<TabRoute[]>(
    collections.map((collection) => ({
      key: collection.id,
      title: collection.name,
    })),
  );

  const renderScene = ({ route }: SceneRendererProps & { route: TabRoute }) => {
    const collection = collections.find((c) => c.id === route.key);
    if (!collection) return null;

    return <TrackerGridView isReordering={false} trackers={mockTrackers} />;
  };

  const renderTabBar = (props: SceneRendererProps & { navigationState: NavigationState<TabRoute> }) => (
    <TabBar {...props} style={styles.tabBar} indicatorStyle={styles.indicator} scrollEnabled />
  );

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

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1B1E",
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
  tabBar: {
    backgroundColor: "#1A1B1E",
  },
  indicator: {
    backgroundColor: "#7B2EDA",
  },
});

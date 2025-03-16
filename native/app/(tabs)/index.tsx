import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { type NavigationState, type Route, type SceneRendererProps, TabBar, TabView } from "react-native-tab-view";
import { Ionicons } from "@expo/vector-icons";
import TrackerGridView from "@/components/TrackerGridView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/db";
import { collectionsTable, trackersTable } from "@/db/schema";

type TabRoute = Route & {
  key: string;
  title: string;
};

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: collections } = useLiveQuery(db.select().from(collectionsTable));
  const { data: trackers } = useLiveQuery(db.select().from(trackersTable));

  const [routes] = useState<TabRoute[]>(
    collections.map((collection) => ({
      key: String(collection.id),
      title: collection.name,
    })),
  );

  const renderScene = ({ route }: SceneRendererProps & { route: TabRoute }) => {
    const collection = collections.find((c) => c.id === +route.key);
    if (!collection) return null;

    return <TrackerGridView isReordering={false} trackers={trackers} />;
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

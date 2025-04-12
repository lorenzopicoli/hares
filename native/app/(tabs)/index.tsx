import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { type NavigationState, type Route, type SceneRendererProps, TabBar, TabView } from "react-native-tab-view";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/db";
import { collectionsTable, type Tracker } from "@/db/schema";
import TrackerGridView from "@/components/TrackerGridView";
import type { ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { router } from "expo-router";
import SearchInput from "@/components/SearchInput";
import { Sizes } from "@/constants/Sizes";

type TabRoute = Route & {
  key: string;
  title: string;
};

export default function HomeScreen() {
  const { styles } = useStyles(createStyles);
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: collectionsDb } = useLiveQuery(db.select().from(collectionsTable).orderBy(collectionsTable.index));
  const collections = useMemo(() => [{ id: -1, name: "All" }, ...collectionsDb], [collectionsDb]);

  const [routes, setRoutes] = useState<TabRoute[]>(
    collections.map((collection) => ({
      key: String(collection.id),
      title: collection.name,
    })),
  );

  const handleTrackerSelection = (tracker: Tracker) => {
    router.navigate({ pathname: "/addEntry", params: { trackerId: tracker.id } });
  };

  useEffect(() => {
    setRoutes(
      collections.map((collection) => ({
        key: String(collection.id),
        title: collection.name,
      })),
    );
  }, [collections]);

  const renderScene = ({ route }: SceneRendererProps & { route: TabRoute }) => {
    return (
      <TrackerGridView
        onSelectTracker={handleTrackerSelection}
        isReordering={false}
        collectionId={+route.key === -1 ? undefined : +route.key}
      />
    );
  };

  const renderTabBar = (props: SceneRendererProps & { navigationState: NavigationState<TabRoute> }) => (
    <TabBar {...props} style={styles.tabBar} indicatorStyle={styles.indicator} scrollEnabled />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput value={searchQuery} placeholder="Search..." onChange={setSearchQuery} />
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
    </View>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    searchContainer: {
      paddingHorizontal: Sizes.small,
    },
    tabBar: {
      backgroundColor: theme.background,
    },
    indicator: {
      backgroundColor: theme.tint,
    },
  });

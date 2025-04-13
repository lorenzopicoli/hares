import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { type NavigationState, type Route, type SceneRendererProps, TabBar, TabView } from "react-native-tab-view";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/db";
import { collectionsTable, type Tracker } from "@/db/schema";
import TrackerGridView from "@/components/TrackerGridView";
import { useColors, type ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { useNavigation, useRouter } from "expo-router";
import SearchInput from "@/components/SearchInput";
import { Sizes } from "@/constants/Sizes";
import { Entypo } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";

type TabRoute = Route & {
  key: string;
  title: string;
};

export default function TrackScreen() {
  const { styles } = useStyles(createStyles);
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: collectionsDb } = useLiveQuery(db.select().from(collectionsTable).orderBy(collectionsTable.index));
  const collections = useMemo(() => [{ id: -1, name: "All" }, ...collectionsDb], [collectionsDb]);
  const router = useRouter();
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors } = useColors();

  const [routes, setRoutes] = useState<TabRoute[]>(
    collections.map((collection) => ({
      key: String(collection.id),
      title: collection.name,
    })),
  );

  const handleTrackerSelection = (tracker: Tracker) => {
    router.navigate({ pathname: "/entry/addEntry", params: { trackerId: tracker.id } });
  };

  const actionSheetParams = useMemo(() => {
    const actionSheetOptions =
      index === 0
        ? ["Add tracker", "Add collection", "Cancel"]
        : ["Add tracker", "Add collection", "Edit current collection", "Cancel"];
    const cancelButtonIndex = actionSheetOptions.length - 1;
    return {
      options: actionSheetOptions,
      cancelButtonIndex,
      containerStyle: { backgroundColor: colors.background },
      textStyle: { color: colors.text },
    };
  }, [colors.text, colors.background, index]);

  const handleManage = useCallback(() => {
    showActionSheetWithOptions(actionSheetParams, (selectedIndex?: number) => {
      switch (selectedIndex) {
        case 0:
          router.navigate("/tracker/addTracker");
          break;

        case 1:
          router.navigate("/collection/addCollection");
          break;

        case 2:
          if (index !== 0) {
            router.navigate({
              pathname: "/collection/addCollection",
              params: { collectionId: index === 0 ? undefined : collections[index].id },
            });
          }
          break;

        default:
      }
    });
  }, [index, router, collections[index].id, showActionSheetWithOptions, actionSheetParams]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          {/* On press in because of: https://github.com/expo/expo/issues/29489 */}
          <TouchableOpacity onPressIn={handleManage}>
            <Entypo name="dots-three-vertical" size={25} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handleManage]);

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

import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { type NavigationState, type Route, type SceneRendererProps, TabBar, TabView } from "react-native-tab-view";
import type { Tracker } from "@/db/schema";
import TrackerGridView from "@/components/TrackerGridView";
import type { ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { useNavigation, useRouter } from "expo-router";
import SearchInput from "@/components/SearchInput";
import { Sizes } from "@/constants/Sizes";
import { Entypo } from "@expo/vector-icons";
import { useCollections } from "@/hooks/data/useCollections";
import { useTrackScreenActions } from "@/hooks/useTrackerActions";

type TabRoute = Route & {
  key: string;
  title: string;
};

export default function TrackScreen() {
  const { styles } = useStyles(createStyles);
  const router = useRouter();
  const navigation = useNavigation();

  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { collectionsWithAll: collections } = useCollections();
  const { handleTrackScreenOptions } = useTrackScreenActions(collections[tabIndex].id);
  const tabs = useMemo(
    () =>
      collections.map((collection) => ({
        key: String(collection.id),
        title: collection.name,
      })),
    [collections],
  );

  const handleTrackerSelection = useCallback(
    (tracker: Tracker) => {
      router.navigate({ pathname: "/entry/addEntry", params: { trackerId: tracker.id } });
    },
    [router],
  );

  const renderTrackers = useCallback(
    ({ route }: SceneRendererProps & { route: TabRoute }) => {
      return (
        <TrackerGridView
          searchQuery={searchQuery}
          onSelectTracker={handleTrackerSelection}
          isReordering={false}
          collectionId={+route.key === -1 ? undefined : +route.key}
        />
      );
    },
    [handleTrackerSelection, searchQuery],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          {/* On press in because of: https://github.com/expo/expo/issues/29489 */}
          <TouchableOpacity onPressIn={handleTrackScreenOptions}>
            <Entypo name="dots-three-vertical" size={25} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handleTrackScreenOptions]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput value={searchQuery} placeholder="Search..." onChange={setSearchQuery} />
      </View>

      <TabView
        navigationState={{ index: tabIndex, routes: tabs }}
        renderScene={renderTrackers}
        onIndexChange={setTabIndex}
        renderTabBar={TrackerTabBar}
      />
    </View>
  );
}

function TrackerTabBar(props: SceneRendererProps & { navigationState: NavigationState<TabRoute> }) {
  const { styles } = useStyles(createStyles);
  return <TabBar {...props} style={styles.tabBar} indicatorStyle={styles.indicator} scrollEnabled />;
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

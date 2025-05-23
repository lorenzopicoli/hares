import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { type NavigationState, type Route, type SceneRendererProps, TabBar, TabView } from "react-native-tab-view";
import type { Tracker } from "@/db/schema";
import TrackerGridView from "@/components/TrackerGridView";
import { useColors, type ThemedColors } from "@/contexts/ThemeContext";
import useStyles from "@/hooks/useStyles";
import { useNavigation, useRouter } from "expo-router";
import SearchInput from "@/components/SearchInput";
import { Sizes } from "@/constants/Sizes";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useCollections } from "@/hooks/data/useCollections";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { TrackScreenBottomSheet } from "@/components/BottomSheets/TrackScreenBottomSheet";
import {
  TrackerOptionsBottomSheet,
  type TrackerOptionsBottomSheetRef,
} from "@/components/BottomSheets/TrackerOptionsBottomSheet";
import { XStack } from "@/components/Stacks";
import { Fonts } from "@/constants/Colors";
import { useSettings } from "@/contexts/SettingsContext";

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
  const { colors } = useColors();
  const { settings } = useSettings();

  const { collectionsWithAll, collections: collectionsWithoutAll } = useCollections();

  const collections = useMemo(
    () => (settings.showAllCollection ? collectionsWithAll : collectionsWithoutAll),
    [collectionsWithAll, collectionsWithoutAll, settings.showAllCollection],
  );

  const screenBottomSheetRef = useRef<BottomSheetModal>(null);
  const trackerOptionsBottomSheetRef = useRef<TrackerOptionsBottomSheetRef>(null);

  const showScreenBottomSheet = useCallback(() => {
    screenBottomSheetRef.current?.present();
  }, []);

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

  const handleTrackerLongPress = useCallback((tracker: Tracker) => {
    trackerOptionsBottomSheetRef.current?.presentWithTrackerId(tracker.id);
  }, []);

  const renderTrackers = useCallback(
    ({ route }: SceneRendererProps & { route: TabRoute }) => {
      return (
        <TrackerGridView
          searchQuery={searchQuery}
          onSelectTracker={handleTrackerSelection}
          onLongPressTracker={handleTrackerLongPress}
          collectionId={+route.key === -1 ? undefined : +route.key}
        />
      );
    },
    [handleTrackerSelection, handleTrackerLongPress, searchQuery],
  );

  const collectionId = useMemo(() => (tabIndex !== 0 ? tabIndex : undefined), [tabIndex]);

  const handleEdit = useCallback(() => {
    router.navigate({
      pathname: "/collection/addCollection",
      params: { collectionId, isEditingAll: collectionId ? undefined : "true" },
    });
  }, [router, collectionId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack>
          <TouchableOpacity onPressIn={showScreenBottomSheet}>
            <Entypo name="plus" size={30} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPressIn={handleEdit}>
            <MaterialIcons name="mode-edit" size={20} color={colors.text} />
          </TouchableOpacity>
        </XStack>
      ),
    });
  }, [colors.text, navigation, showScreenBottomSheet, handleEdit]);

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
        commonOptions={{
          labelStyle: { ...Fonts.medium },
        }}
      />

      <TrackScreenBottomSheet collectionId={collectionId} ref={screenBottomSheetRef} />
      <TrackerOptionsBottomSheet ref={trackerOptionsBottomSheetRef} />
    </View>
  );
}

function TrackerTabBar(props: SceneRendererProps & { navigationState: NavigationState<TabRoute> }) {
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();
  return (
    <TabBar
      {...props}
      activeColor={colors.tint}
      inactiveColor={colors.text}
      style={styles.tabBar}
      indicatorStyle={styles.indicator}
      scrollEnabled
    />
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    searchContainer: {
      paddingHorizontal: Sizes.medium,
    },
    tabBar: {
      backgroundColor: theme.background,
    },
    indicator: {
      backgroundColor: theme.tint,
    },
  });

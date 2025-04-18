import React, { useEffect, useState } from "react";
import { FlatList, LogBox, StyleSheet, TouchableOpacity, View, type ListRenderItemInfo } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import type { Collection, NewCollection, NewCollectionTracker, Tracker } from "@/db/schema";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import {
  NestedReorderableList,
  ScrollViewContainer,
  useReorderableDrag,
  type ReorderableListReorderEvent,
} from "react-native-reorderable-list";
import { Pressable } from "react-native-gesture-handler";
import type { ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Separator } from "@/components/Separator";
import { Spacing } from "@/components/Spacing";
import ThemedInput from "@/components/ThemedInput";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { moveElement } from "@/utils/moveElements";
import { useCollection } from "@/hooks/data/useCollection";
import { useTrackers, useTrackersNotInCollection } from "@/hooks/data/useTrackers";
import { useUpsertCollection } from "@/hooks/data/useUpsertCollection";

LogBox.ignoreLogs(["VirtualizedLists should never be nested inside plain ScrollViews"]);

interface TrackItemProps {
  tracker: Tracker;
  onPress?: (tracker: Tracker) => void;
  onRemove?: (tracker: Tracker) => void;
  onLongPress?: () => void;
}

interface AddCollectionInternalProps {
  collectionTrackers: Tracker[];
  nonCollectionTrackers: Tracker[];
  collection?: Collection;
}

function DraggableTrackerItem(props: TrackItemProps) {
  const drag = useReorderableDrag();
  return <TrackerItem onLongPress={drag} {...props} />;
}
function TrackerItem(props: TrackItemProps) {
  const { styles } = useStyles(createStyles);
  const handleRemove = () => {
    props.onRemove?.(props.tracker);
  };
  const handlePress = () => {
    props.onPress?.(props.tracker);
  };
  return (
    <TouchableOpacity onPress={handlePress} onLongPress={props.onLongPress}>
      <View style={styles.itemContainer}>
        <ThemedText>{props.tracker.name}</ThemedText>
        {props.onRemove ? (
          <View style={styles.itemActions}>
            <Pressable onPress={handleRemove}>
              <Feather name="x" size={25} color="#fff" />
            </Pressable>
            <MaterialIcons name="drag-indicator" size={25} color="#fff" />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

function AddCollectionScreenInternal(props: AddCollectionInternalProps) {
  const router = useRouter();
  const { upsertCollection } = useUpsertCollection();
  const {
    nonCollectionTrackers: preExistingNonCollectionTrackers,
    collectionTrackers: preExistingCollectionTrackers,
    collection,
  } = props;
  const [collectionTrackers, setCollectionTrackers] = useState<Tracker[]>([]);
  const [nonCollectionTrackers, setNonCollectionTrackers] = useState<Tracker[]>([]);
  const [name, setName] = useState("");
  const { styles } = useStyles(createStyles);

  useEffect(() => {
    setCollectionTrackers(preExistingCollectionTrackers);
    setNonCollectionTrackers(preExistingNonCollectionTrackers);
    if (collection) {
      setName(collection.name);
    }
  }, [preExistingCollectionTrackers, preExistingNonCollectionTrackers, collection]);

  const handleSubmit = async () => {
    if (!name) {
      throw new Error("Missing data");
    }
    const newCollection: Omit<NewCollection, "index"> = {
      name,
    };

    const relationship: Omit<NewCollectionTracker, "collectionId">[] = collectionTrackers.map((t, i) => ({
      index: i,
      trackerId: t.id,
    }));

    await upsertCollection(newCollection, relationship, collection?.id).catch((e) => {
      console.log("Failed to upsert collection", e);
    });

    router.dismiss();
  };

  const addTrackerToCollection = (tracker: Tracker) => {
    setCollectionTrackers([...collectionTrackers, { ...tracker }]);
    setNonCollectionTrackers([...nonCollectionTrackers.filter((t) => t.id !== tracker.id)]);
  };

  const handleTrackerReorder = (event: ReorderableListReorderEvent) => {
    setCollectionTrackers(moveElement(collectionTrackers, event));
  };

  const handleRemoveTracker = (tracker: Tracker) => {
    setNonCollectionTrackers([...nonCollectionTrackers, { ...tracker }]);
    setCollectionTrackers([...collectionTrackers.filter((t) => t.id !== tracker.id)]);
  };

  const renderDraggableTracker = ({ item }: ListRenderItemInfo<Tracker>) => {
    return <DraggableTrackerItem onRemove={handleRemoveTracker} tracker={item} />;
  };
  const renderNonDraggableTracker = ({ item }: ListRenderItemInfo<Tracker>) => {
    return <TrackerItem onPress={addTrackerToCollection} tracker={item} />;
  };
  const trackerKeyExtractor = (tracker: Tracker, _index: number) => String(tracker.id);

  return (
    <ThemedView>
      <ScrollViewContainer style={styles.scrollView}>
        <ThemedView style={styles.form}>
          <ThemedInput label="Collection name" value={name} onChangeText={setName} />
        </ThemedView>
        {collectionTrackers && (
          <>
            <ThemedText style={styles.title} type="title">
              Trackers in this collection
            </ThemedText>
            <NestedReorderableList
              style={styles.reorderableList}
              data={collectionTrackers ?? []}
              renderItem={renderDraggableTracker}
              keyExtractor={trackerKeyExtractor}
              onReorder={handleTrackerReorder}
              ItemSeparatorComponent={Separator}
            />
          </>
        )}
        <Spacing size="medium" />
        {nonCollectionTrackers && (
          <>
            <ThemedText style={styles.title} type="title">
              Not in this collection
            </ThemedText>
            <FlatList
              style={styles.reorderableList}
              data={nonCollectionTrackers ?? []}
              renderItem={renderNonDraggableTracker}
              keyExtractor={trackerKeyExtractor}
              ItemSeparatorComponent={Separator}
            />
          </>
        )}
      </ScrollViewContainer>
      <View style={styles.submitButtonContainer}>
        <ThemedButton fullWidth title={collection ? "Edit collection" : "Create collection"} onPress={handleSubmit} />
      </View>
    </ThemedView>
  );
}

export default function AddCollectionScreen() {
  const { collectionId } = useLocalSearchParams<{ collectionId?: string }>();
  const { collection } = useCollection(+(collectionId ?? -1));
  const { trackers: collectionTrackers } = useTrackers({ collectionId: collectionId ? +collectionId : undefined });
  const { trackers: nonCollectionTrackers } = useTrackersNotInCollection({ collectionId: +(collectionId ?? -1) });

  return (
    <AddCollectionScreenInternal
      collectionTrackers={collectionTrackers}
      nonCollectionTrackers={nonCollectionTrackers}
      collection={collection}
    />
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    title: {
      marginLeft: Sizes.medium,
    },
    scrollView: {
      marginTop: Sizes.medium,
    },
    form: {
      margin: Sizes.medium,
    },
    itemContainer: {
      display: "flex",
      flexDirection: "row",
      height: Sizes.list.large,
      paddingHorizontal: Sizes.large,
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "visible",
    },
    itemActions: {
      display: "flex",
      gap: Sizes.small,
      flexDirection: "row",
    },
    reorderableList: {
      overflow: "visible",
    },
    submitButtonContainer: {
      paddingHorizontal: Sizes.medium,
      marginBottom: Sizes.medium,
    },
  });

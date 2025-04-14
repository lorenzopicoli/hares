import React, { memo, useEffect, useState } from "react";
import { FlatList, LogBox, StyleSheet, View, type ListRenderItemInfo } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import {
  collectionsTable,
  collectionsTrackersTable,
  trackersTable,
  type Collection,
  type NewCollection,
  type NewCollectionTracker,
  type Tracker,
} from "@/db/schema";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import {
  NestedReorderableList,
  ScrollViewContainer,
  useReorderableDrag,
  type ReorderableListReorderEvent,
} from "react-native-reorderable-list";
import { Pressable, TouchableOpacity } from "react-native-gesture-handler";
import type { ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Separator } from "@/components/Separator";
import { Spacing } from "@/components/Spacing";
import ThemedInput from "@/components/ThemedInput";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { eq, notExists, sql } from "drizzle-orm";
import { moveElement } from "@/utils/moveElements";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDatabase } from "@/contexts/DatabaseContext";

LogBox.ignoreLogs(["VirtualizedLists should never be nested inside plain ScrollViews"]);

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

const DraggableTrackerItem: React.FC<{ tracker: Tracker; onRemove: (tracker: Tracker) => void }> = memo((props) => {
  const drag = useReorderableDrag();
  const { styles } = useStyles(createStyles);

  return (
    <Pressable onLongPress={drag}>
      <View style={styles.itemContainer}>
        <ThemedText>{props.tracker.name}</ThemedText>
        <View style={styles.itemActions}>
          <Pressable onPress={() => props.onRemove(props.tracker)}>
            <Feather name="x" size={25} color="#fff" />
          </Pressable>
          <MaterialIcons name="drag-indicator" size={25} color="#fff" />
        </View>
      </View>
    </Pressable>
  );
});

const NonDraggableTrackerItem: React.FC<{ tracker: Tracker; onPress: (tracker: Tracker) => void }> = memo((props) => {
  const { styles } = useStyles(createStyles);

  return (
    <TouchableOpacity onPress={() => props.onPress(props.tracker)}>
      <View style={styles.itemContainer}>
        <ThemedText>{props.tracker.name}</ThemedText>
      </View>
    </TouchableOpacity>
  );
});

function AddCollectionScreenInternal(props: {
  collectionTrackers: Tracker[];
  nonCollectionTrackers: Tracker[];
  collection?: Collection;
}) {
  const router = useRouter();
  const { db } = useDatabase();
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
    const nextIndex = await db
      .select({
        index: collectionsTable.index,
      })
      .from(collectionsTable)
      .orderBy(collectionsTable.index)
      .limit(1);

    const newCollection: NewCollection = {
      name,
      index: (nextIndex?.[0]?.index ?? 0) + 1,
    };

    const { savedCollectionId } = collection
      ? await db
          .update(collectionsTable)
          .set(newCollection)
          .where(eq(collectionsTable.id, collection.id))
          .then(() => ({
            savedCollectionId: collection.id,
          }))
          .catch((err) => {
            console.log("Failed to update collection", err);
            throw err;
          })
      : await db
          .insert(collectionsTable)
          .values(newCollection)
          .returning({ savedCollectionId: collectionsTable.id })
          .then((values) => values[0])
          .catch((err) => {
            console.log("Failed to save collection", err);
            throw err;
          });

    const relationship: NewCollectionTracker[] = collectionTrackers.map((t, i) => ({
      index: i,
      trackerId: t.id,
      collectionId: savedCollectionId,
    }));

    if (collection) {
      // Easier than finding the diff
      await db.delete(collectionsTrackersTable).where(eq(collectionsTrackersTable.collectionId, collection.id));
    }
    await db
      .insert(collectionsTrackersTable)
      .values(relationship)
      // Shouldn't happen, but it looks nice
      .onConflictDoUpdate({
        target: [collectionsTrackersTable.trackerId, collectionsTrackersTable.collectionId],
        set: { index: sql.raw('"excluded"."index"') },
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
    return <NonDraggableTrackerItem onPress={addTrackerToCollection} tracker={item} />;
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
  const { collectionId } = useLocalSearchParams<{ collectionId: string }>();
  const { db } = useDatabase();
  const { data: collection } = useLiveQuery(
    db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.id, collectionId ? +collectionId : -1)),
  );
  const { data: collectionTrackers } = useLiveQuery(
    db
      .select()
      .from(trackersTable)
      .innerJoin(collectionsTrackersTable, eq(collectionsTrackersTable.trackerId, trackersTable.id))
      .where(eq(collectionsTrackersTable.collectionId, Number(collectionId) || -1))
      .orderBy(collectionsTrackersTable.index),
  );
  const { data: nonCollectionTrackers } = useLiveQuery(
    db
      .select()
      .from(trackersTable)
      .where(
        notExists(
          db
            .select()
            .from(collectionsTrackersTable)
            .where(sql`${collectionsTrackersTable.collectionId} = ${Number(collectionId) || -1} AND
            ${collectionsTrackersTable.trackerId} = ${trackersTable.id}`),
        ),
      )
      .orderBy(trackersTable.index),
  );
  const { data: all } = useLiveQuery(
    db
      .select()
      .from(collectionsTrackersTable)
      .where(eq(collectionsTrackersTable.collectionId, Number(collectionId) || -1)),
  );

  console.log("non", all);

  return (
    <AddCollectionScreenInternal
      collectionTrackers={collectionTrackers.map((ct) => ct.trackers)}
      nonCollectionTrackers={nonCollectionTrackers}
      collection={collection[0]}
    />
  );
}

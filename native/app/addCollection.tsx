import React, { memo, useState } from "react";
import { FlatList, LogBox, StyleSheet, View, type ListRenderItemInfo } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { collectionsTable, trackersTable, type NewCollection, type Tracker } from "@/db/schema";
import { db } from "@/db";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import useDbQuery from "@/hooks/useDbQuery";
import { NestedReorderableList, ScrollViewContainer, useReorderableDrag } from "react-native-reorderable-list";
import { Pressable, TouchableOpacity } from "react-native-gesture-handler";
import type { ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Separator } from "@/components/Separator";
import { Spacing } from "@/components/Spacing";
import ThemedInput from "@/components/ThemedInput";
import { MaterialIcons } from "@expo/vector-icons";

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
    reorderableList: {
      overflow: "visible",
    },
    submitButtonContainer: {
      paddingHorizontal: Sizes.medium,
      marginBottom: Sizes.medium,
    },
  });

const DraggableTrackerItem: React.FC<{ tracker: Tracker }> = memo((props) => {
  const drag = useReorderableDrag();
  const { styles } = useStyles(createStyles);

  return (
    <Pressable onLongPress={drag}>
      <View style={styles.itemContainer}>
        <ThemedText>{props.tracker.name}</ThemedText>
        <MaterialIcons name="drag-indicator" size={20} color="#fff" />
      </View>
    </Pressable>
  );
});

const NonDraggableTrackerItem: React.FC<{ tracker: Tracker; onPress: () => void }> = memo((props) => {
  const { styles } = useStyles(createStyles);

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.itemContainer}>
        <ThemedText>{props.tracker.name}</ThemedText>
      </View>
    </TouchableOpacity>
  );
});

export default function AddCollectionScreen() {
  const [name, setName] = useState("");
  const { data: trackers } = useDbQuery<typeof trackersTable>(
    db.select().from(trackersTable).orderBy(trackersTable.index).$dynamic(),
  );
  const { styles } = useStyles(createStyles);

  const handleSubmit = async () => {
    console.log("On submit", name);
    if (!name) {
      console.log("aAme", name);
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

    await db
      .insert(collectionsTable)
      .values(newCollection)
      .catch((bla) => console.log(bla));
    router.back();
  };

  const addTrackerToCollection = () => {
    console.log("clicked");
  };

  const renderDraggableTracker = ({ item }: ListRenderItemInfo<Tracker>) => {
    return <DraggableTrackerItem tracker={item} />;
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
        <ThemedText style={styles.title} type="title">
          Trackers in this collection
        </ThemedText>
        <NestedReorderableList
          style={styles.reorderableList}
          data={trackers ?? []}
          renderItem={renderDraggableTracker}
          keyExtractor={trackerKeyExtractor}
          onReorder={(trackers) => console.log(trackers)}
          ItemSeparatorComponent={Separator}
        />
        <Spacing size="large" />
        <ThemedText style={styles.title} type="title">
          Not in this collection
        </ThemedText>
        <FlatList
          style={styles.reorderableList}
          data={trackers ?? []}
          renderItem={renderNonDraggableTracker}
          keyExtractor={trackerKeyExtractor}
          ItemSeparatorComponent={Separator}
        />
      </ScrollViewContainer>
      <View style={styles.submitButtonContainer}>
        <ThemedButton fullWidth title="Create collection" onPress={handleSubmit} />
      </View>
    </ThemedView>
  );
}

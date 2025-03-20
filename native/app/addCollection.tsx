import React, { memo, useState } from "react";
import { StyleSheet, View, type ListRenderItemInfo } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { collectionsTable, trackersTable, type NewCollection, type Tracker } from "@/db/schema";
import { db } from "@/db";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import useDbQuery from "@/hooks/useDbQuery";
import { NestedReorderableList, ScrollViewContainer, useReorderableDrag } from "react-native-reorderable-list";
import { Pressable } from "react-native-gesture-handler";

const TrackerItem: React.FC<{ tracker: Tracker }> = memo((tracker) => {
  const drag = useReorderableDrag();

  return (
    <Pressable onLongPress={drag}>
      <ThemedText>{tracker.tracker.name}</ThemedText>
    </Pressable>
  );
});

export default function AddCollectionScreen() {
  const [name, setName] = useState("");
  const { data: trackers } = useDbQuery<typeof trackersTable>(
    db.select().from(trackersTable).orderBy(trackersTable.index).$dynamic(),
  );

  const handleSubmit = async () => {
    console.log("On submit", name);
    if (!name) {
      console.log("NAme", name);
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

  const renderTracker = ({ item }: ListRenderItemInfo<Tracker>) => {
    return <TrackerItem tracker={item} />;
  };
  const trackerKeyExtractor = (tracker: Tracker, _index: number) => String(tracker.id);

  return (
    <ThemedView>
      <ScrollViewContainer>
        <ThemedText>In the collection</ThemedText>
        <NestedReorderableList
          data={trackers ?? []}
          renderItem={renderTracker}
          keyExtractor={trackerKeyExtractor}
          onReorder={(trackers) => console.log(trackers)}
        />
        <ThemedText>Not in the collection</ThemedText>
        {/* <FlatList data={trackers} renderItem={renderTracker} keyExtractor={trackerKeyExtractor} /> */}
      </ScrollViewContainer>
      {/* <ThemedScrollView>
        <ThemedInput label="Collection name" value={name} onChangeText={setName} />
        <View>
          <TrackerGridView horizontalPadding={false} isReordering={true} trackers={trackers} />
        </View>
      </ThemedScrollView> */}
      <View style={styles.submitButtonContainer}>
        <ThemedButton fullWidth title="Create collection" onPress={handleSubmit} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  submitButtonContainer: {
    paddingHorizontal: Sizes.medium,
    marginBottom: Sizes.medium,
  },
});

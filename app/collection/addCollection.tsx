import React, { useEffect, useMemo, useState } from "react";
import { LogBox, StyleSheet, TouchableOpacity, View, type ListRenderItemInfo } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedSafeAreaView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import type { NewCollectionTracker, Tracker } from "@/db/schema";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import {
  NestedReorderableList,
  ScrollViewContainer,
  useReorderableDrag,
  type ReorderableListReorderEvent,
} from "react-native-reorderable-list";
import { useColors, type ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Separator } from "@/components/Separator";
import { Spacing } from "@/components/Spacing";
import { FormThemedInput } from "@/components/ThemedInput";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { useTrackersForAddCollection } from "@/hooks/data/useTrackers";
import { useUpsertCollection } from "@/hooks/data/useUpsertCollection";
import { Controller, useFieldArray, useForm, type FieldArrayWithId } from "react-hook-form";
import ThemedInputLabel from "@/components/ThemedInputLabel";
import { useLazyCollection } from "@/hooks/data/useCollection";
import SearchInput from "@/components/SearchInput";
import { useReorderTrackers } from "@/hooks/data/useReorderTrackers";

LogBox.ignoreLogs(["VirtualizedLists should never be nested inside plain ScrollViews"]);

interface TrackItemProps {
  tracker: TrackerInCollection;
  onPress?: (tracker: TrackerInCollection) => void;
  onRemove?: (tracker: TrackerInCollection) => void;
  hideDrag?: boolean;
  hideRemove?: boolean;
}

interface TrackerInCollection {
  tracker: Tracker;
  isInCollection: boolean;
}

interface FormInputs {
  name: string;
  trackers: TrackerInCollection[];
}

function TrackerItem(props: TrackItemProps) {
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();
  const drag = useReorderableDrag();
  const handlePress = () => {
    props.onPress?.(props.tracker);
  };
  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={props.tracker.isInCollection && !props.hideDrag ? drag : undefined}
    >
      <View style={styles.itemContainer}>
        <ThemedText>{props.tracker.tracker.name}</ThemedText>
        <View style={styles.itemActions}>
          {props.tracker.isInCollection && !props.hideRemove && <Feather name="x" size={25} color={colors.text} />}
          {props.tracker.isInCollection && <MaterialIcons name="drag-indicator" size={25} color={colors.text} />}
          {!props.tracker.isInCollection && <Entypo name="plus" size={24} color={colors.text} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AddCollectionScreen() {
  const router = useRouter();
  const { styles } = useStyles(createStyles);
  const { collectionId: collectionIdParam, isEditingAll } = useLocalSearchParams<{
    collectionId?: string;
    isEditingAll?: string;
  }>();
  const collectionId = useMemo(() => (collectionIdParam ? +collectionIdParam : undefined), [collectionIdParam]);

  const [isOutOfOrder, setIsOutOfOrder] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const { upsertCollection } = useUpsertCollection();
  const { fetchCollection } = useLazyCollection();
  const { fetchTrackersForAddCollection, fetchAllTrackers } = useTrackersForAddCollection();
  const { reorderTrackers } = useReorderTrackers();

  const { control, handleSubmit } = useForm<FormInputs>({
    defaultValues: async () => {
      const trackers = isEditingAll ? await fetchAllTrackers() : await fetchTrackersForAddCollection(collectionId);

      if (isEditingAll) {
        return {
          name: "All",
          trackers,
        };
      }

      if (collectionId) {
        const collection = await fetchCollection(collectionId);
        return {
          name: collection?.name ?? "",
          trackers,
        };
      }
      const defaultValues: FormInputs = {
        name: "",
        trackers,
      };
      return defaultValues;
    },
  });
  const { fields, append, replace, remove, move, insert } = useFieldArray({
    control,
    name: "trackers",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Because of the draggable list library, I can't stop the user from moving a tracker
    // that is in the collection to, say, the end of the list. When that happens I mark the
    // list as out of order and fix it in the next render
    if (isOutOfOrder) {
      const inCollectionFields = fields.filter((f) => f.isInCollection);
      const notInCollectionFields = fields.filter((f) => !f.isInCollection);
      replace([...inCollectionFields, ...notInCollectionFields]);
      setIsOutOfOrder(false);
    }
  }, [isOutOfOrder]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: collectionId || isEditingAll ? "🐰 Edit collection" : "🐰 Add collection",
    });
  }, [collectionId, isEditingAll, navigation]);

  const onSubmit = async (data: FormInputs) => {
    const relationship: Omit<NewCollectionTracker, "collectionId">[] = data.trackers
      .filter((t) => t.isInCollection)
      .map((t, i) => ({
        index: i,
        trackerId: t.tracker.id,
      }));

    if (isEditingAll) {
      await reorderTrackers(relationship);
    } else {
      await upsertCollection({ name: data.name }, relationship, collectionId).catch((e) => {
        console.log("Failed to upsert collection", e);
      });
    }

    router.dismiss();
  };

  const handleAddTracker = (tracker: TrackerInCollection, fieldId: string) => {
    const newTracker: TrackerInCollection = { ...tracker, isInCollection: true };
    const firstNotInCollection = fields.findIndex((f) => !f.isInCollection);
    const index = fields.findIndex((f) => f.id === fieldId);

    remove(index);
    if (firstNotInCollection > -1) {
      insert(firstNotInCollection, newTracker);
    } else {
      append(newTracker);
    }
  };

  const handleTrackerReorder = (event: ReorderableListReorderEvent) => {
    const firstNotInCollection = fields.findIndex((f) => !f.isInCollection);

    move(event.from, event.to);
    // Tried to move a tracker in collection after a tracker not in collection
    // marks the list as out of order so it can be fixed in the next render cycle
    if (event.to > firstNotInCollection) {
      setIsOutOfOrder(true);
    }
  };

  const handleRemoveTracker = (tracker: TrackerInCollection, fieldId: string) => {
    const firstNotInCollection = fields.findIndex((f) => !f.isInCollection);
    const newTracker = { ...tracker, isInCollection: false };
    const index = fields.findIndex((f) => f.id === fieldId);

    remove(index);
    if (firstNotInCollection > -1) {
      insert(Math.max(0, firstNotInCollection - 1), newTracker);
    } else {
      append(newTracker);
    }
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<FieldArrayWithId<FormInputs, "trackers", "id">>) => {
    const handlePress = (tracker: TrackerInCollection) => {
      if (tracker.isInCollection) {
        handleRemoveTracker(tracker, item.id);
      } else {
        handleAddTracker(tracker, item.id);
      }
    };

    return (
      <Controller
        control={control}
        key={item.id}
        name={`trackers.${index}`}
        render={({ field: { value: _value } }) => {
          return (
            <TrackerItem
              hideRemove={!!isEditingAll}
              hideDrag={searchQuery !== ""}
              onPress={isEditingAll ? undefined : handlePress}
              tracker={item}
            />
          );
        }}
      />
    );
  };

  // Very much not efficient, but it's awkward to fetch the data from the DB with search while also keeping track of the fields
  // state for react hook form. Might consider just dropping react hook form for this
  const filteredTrackers = useMemo(() => {
    return fields.filter((f) => f.tracker.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [fields, searchQuery]);

  return (
    <ThemedSafeAreaView>
      <ScrollViewContainer showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <FormThemedInput
          form={{
            control,
            name: "name",
            rules: {
              required: {
                message: "Name is required",
                value: !isEditingAll,
              },
            },
          }}
          editable={!isEditingAll}
          label="Collection name"
          autoCapitalize="sentences"
        />

        <ThemedInputLabel label={isEditingAll ? "Reorder trackers" : "Select trackers for this collection"} />

        {!isEditingAll ? <SearchInput value={searchQuery} placeholder="Search..." onChange={setSearchQuery} /> : null}
        <NestedReorderableList
          style={styles.reorderableList}
          data={filteredTrackers}
          renderItem={renderItem}
          keyExtractor={(i) => String(i.tracker.id)}
          onReorder={handleTrackerReorder}
          ItemSeparatorComponent={() => <Separator overrideHorizontalMargin={0} />}
        />
        <Spacing size="medium" />
      </ScrollViewContainer>
      <View style={styles.submitButtonContainer}>
        <ThemedButton
          fullWidth
          title={collectionId || isEditingAll ? "Edit collection" : "Create collection"}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ThemedSafeAreaView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    scrollView: {
      marginTop: Sizes.medium,
      marginHorizontal: Sizes.medium,
    },
    itemContainer: {
      display: "flex",
      flexDirection: "row",
      height: Sizes.list.large,
      paddingHorizontal: Sizes.small,
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

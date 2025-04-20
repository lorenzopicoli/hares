import React, { useEffect, useState } from "react";
import { LogBox, StyleSheet, TouchableOpacity, View, type ListRenderItemInfo } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import type { NewCollection, NewCollectionTracker, Tracker } from "@/db/schema";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import {
  NestedReorderableList,
  ScrollViewContainer,
  useReorderableDrag,
  type ReorderableListReorderEvent,
} from "react-native-reorderable-list";
import type { ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { Separator } from "@/components/Separator";
import { Spacing } from "@/components/Spacing";
import { FormThemedInput } from "@/components/ThemedInput";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { useCollection } from "@/hooks/data/useCollection";
import { useTrackers, useTrackersNotInCollection } from "@/hooks/data/useTrackers";
import { useUpsertCollection } from "@/hooks/data/useUpsertCollection";
import { Controller, useFieldArray, useForm, type FieldArrayWithId } from "react-hook-form";
import ThemedInputLabel from "@/components/ThemedInputLabel";

LogBox.ignoreLogs(["VirtualizedLists should never be nested inside plain ScrollViews"]);

interface TrackItemProps {
  tracker: TrackerInCollection;
  onPress?: (tracker: TrackerInCollection) => void;
  onRemove?: (tracker: TrackerInCollection) => void;
  onLongPress?: () => void;
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
  const drag = useReorderableDrag();
  const handlePress = () => {
    props.onPress?.(props.tracker);
  };
  return (
    <TouchableOpacity onPress={handlePress} onLongPress={props.tracker.isInCollection ? drag : undefined}>
      <View style={styles.itemContainer}>
        <ThemedText>{props.tracker.tracker.name}</ThemedText>
        <View style={styles.itemActions}>
          {props.tracker.isInCollection && <Feather name="x" size={25} color="#fff" />}
          {props.tracker.isInCollection && <MaterialIcons name="drag-indicator" size={25} color="#fff" />}
          {!props.tracker.isInCollection && <Entypo name="plus" size={24} color="#fff" />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function AddCollectionScreenInternal(props: AddCollectionInternalProps) {
  const router = useRouter();
  const { upsertCollection } = useUpsertCollection();
  const { trackers, collection } = props;
  const { styles } = useStyles(createStyles);
  const [isOutOfOrder, setIsOutOfOrder] = useState(false);

  const { control, handleSubmit, watch } = useForm<FormInputs>({
    defaultValues: async () => {
      const defaultValues: FormInputs = {
        name: "",
        trackers,
      };
      return defaultValues;
    },
  });
  const { fields, append, replace, prepend, remove, move, insert } = useFieldArray({
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

  const onSubmit = async (data: FormInputs) => {
    const newCollection: Omit<NewCollection, "index"> = {
      name: data.name,
    };

    const relationship: Omit<NewCollectionTracker, "collectionId">[] = data.trackers
      .filter((t) => t.isInCollection)
      .map((t, i) => ({
        index: i,
        trackerId: t.tracker.id,
      }));

    await upsertCollection(newCollection, relationship, collection?.id).catch((e) => {
      console.log("Failed to upsert collection", e);
    });

    router.dismiss();
  };

  const addTrackerToCollection = (tracker: TrackerInCollection, index: number) => {
    const newTracker: TrackerInCollection = { ...tracker, isInCollection: true };
    const firstNotInCollection = fields.findIndex((f) => !f.isInCollection);
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

  const handleRemoveTracker = (tracker: TrackerInCollection, index: number) => {
    const firstNotInCollection = fields.findIndex((f) => !f.isInCollection);
    const newTracker = { ...tracker, isInCollection: false };
    remove(index);
    if (firstNotInCollection > -1) {
      insert(Math.max(0, firstNotInCollection - 1), newTracker);
    } else {
      append(newTracker);
    }
  };

  const renderDraggableTracker = ({
    item,
    index,
  }: ListRenderItemInfo<FieldArrayWithId<FormInputs, "trackers", "id">>) => {
    const removeTracker = (tracker: TrackerInCollection) => {
      handleRemoveTracker(tracker, index);
    };
    const addTracker = (tracker: TrackerInCollection) => {
      addTrackerToCollection(tracker, index);
    };
    return (
      <Controller
        control={control}
        key={item.id}
        name={`trackers.${index}`}
        render={({ field: { value } }) => {
          return <TrackerItem onPress={value.isInCollection ? removeTracker : addTracker} tracker={item} />;
        }}
      />
    );
  };

  return (
    <ThemedView>
      <ScrollViewContainer style={styles.scrollView}>
        <FormThemedInput
          form={{
            control,
            name: "name",
            rules: {
              required: {
                message: "Name is required",
                value: true,
              },
            },
          }}
          label="Collection name"
          autoCapitalize="sentences"
        />
        <>
          <ThemedInputLabel label="Select trackers for this collection" />

          <NestedReorderableList
            style={styles.reorderableList}
            data={fields}
            renderItem={renderDraggableTracker}
            keyExtractor={(f) => f.id}
            onReorder={handleTrackerReorder}
            ItemSeparatorComponent={Separator}
          />
        </>
        <Spacing size="medium" />
      </ScrollViewContainer>
      <View style={styles.submitButtonContainer}>
        <ThemedButton
          fullWidth
          title={collection ? "Edit collection" : "Create collection"}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ThemedView>
  );
}

export default function AddCollectionScreen() {
  const { collectionId } = useLocalSearchParams<{ collectionId?: string }>();
  const { collection } = useCollection(+(collectionId ?? -1));
  const { trackers: collectionTrackers } = useTrackers({ collectionId: collectionId ? +collectionId : undefined });
  const { trackers: nonCollectionTrackers } = useTrackersNotInCollection({ collectionId: +(collectionId ?? -1) });

  if (collectionTrackers.length === 0 && nonCollectionTrackers.length === 0) {
    return <View />;
  }

  return (
    <AddCollectionScreenInternal
      trackers={[
        ...collectionTrackers.map((tracker) => ({ isInCollection: true, tracker })),
        ...nonCollectionTrackers.map((tracker) => ({ isInCollection: false, tracker })),
      ]}
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
      marginHorizontal: Sizes.medium,
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

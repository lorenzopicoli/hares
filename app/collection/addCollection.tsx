import React from "react";
import { LogBox, StyleSheet, TouchableOpacity, View, type ListRenderItemInfo } from "react-native";
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
import { FormThemedInput } from "@/components/ThemedInput";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { useCollection } from "@/hooks/data/useCollection";
import { useTrackers, useTrackersNotInCollection } from "@/hooks/data/useTrackers";
import { useUpsertCollection } from "@/hooks/data/useUpsertCollection";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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

interface AddCollectionInternalProps {
  //   collectionTrackers: Tracker[];
  //   nonCollectionTrackers: Tracker[];
  trackers: TrackerInCollection[];
  collection?: Collection;
}

function DraggableTrackerItem(props: TrackItemProps) {
  const drag = useReorderableDrag();
  return <TrackerItem onPress={props.onPress} onLongPress={drag} {...props} />;
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
        <ThemedText>{props.tracker.tracker.name}</ThemedText>
        {props.tracker.isInCollection ? (
          <View style={styles.itemActions}>
            <Pressable onPress={handleRemove}>
              <Feather name="x" size={25} color="#fff" />
            </Pressable>
            <MaterialIcons name="drag-indicator" size={25} color="#fff" />
          </View>
        ) : (
          <View style={styles.itemActions}>
            <Entypo name="plus" size={24} color="#fff" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function AddCollectionScreenInternal(props: AddCollectionInternalProps) {
  const router = useRouter();
  const { upsertCollection } = useUpsertCollection();
  const { trackers, collection } = props;
  const { styles } = useStyles(createStyles);

  const { control, handleSubmit, watch } = useForm<FormInputs>({
    defaultValues: async () => {
      const defaultValues: FormInputs = {
        name: "",
        trackers,
      };
      return defaultValues;
    },
  });
  const { fields, append, prepend, remove, move, insert } = useFieldArray({
    control,
    name: "trackers",
  });

  const onSubmit = async (data: FormInputs) => {
    const newCollection: Omit<NewCollection, "index"> = {
      name: data.name,
    };

    console.log(
      "trackers",
      data.trackers.filter((t) => t.isInCollection),
    );
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
    console.log("i", firstNotInCollection);
    if (firstNotInCollection > -1) {
      insert(firstNotInCollection, newTracker);
    } else {
      prepend(newTracker);
    }
    remove(index);
  };

  const handleTrackerReorder = (event: ReorderableListReorderEvent) => {
    move(event.from, event.to);
  };

  const handleRemoveTracker = (tracker: TrackerInCollection, index: number) => {
    const firstNotInCollection = fields.findIndex((f) => !f.isInCollection);
    const newTracker = { ...tracker, isInCollection: false };
    if (firstNotInCollection > -1) {
      insert(firstNotInCollection, newTracker);
    } else {
      append(newTracker);
    }
    remove(index);
  };

  const renderDraggableTracker = ({ item, index }: ListRenderItemInfo<TrackerInCollection>) => {
    const r = (tracker: TrackerInCollection) => {
      handleRemoveTracker(tracker, index);
    };
    const a = (tracker: TrackerInCollection) => {
      addTrackerToCollection(tracker, index);
    };
    return (
      <Controller
        control={control}
        key={item.tracker.id}
        name={`trackers.${index}`}
        render={({ field: { value } }) => {
          return <DraggableTrackerItem onPress={a} onRemove={r} tracker={value} />;
        }}
      />
    );
  };
  const trackerKeyExtractor = (tracker: TrackerInCollection, _index: number) => String(tracker.tracker.id);

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
            keyExtractor={trackerKeyExtractor}
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

  console.log("re-rednder");

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

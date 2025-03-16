import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedInput from "@/components/ThemedInput";
import { useState } from "react";
import ThemedToggleButtons from "@/components/ThemedToggleButtons";
import { StyleSheet, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { trackerNames, trackersTable, type NewTracker, type TrackerType } from "@/db/schema";
import { db } from "@/db";

export default function AddTrackerToCollectionScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<TrackerType | null>(null);
  const [scaleMin, setScaleMin] = useState<number | null>(null);
  const [scaleMax, setScaleMax] = useState<number | null>(null);
  const [textGroup, setTextGroup] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!type || !name) {
      throw new Error("Missing data");
    }
    const tracker: NewTracker = {
      name,
      type,
      description,
    };
    await db.insert(trackersTable).values(tracker);
    console.log("Inserted");
  };

  return (
    <ThemedView>
      <ThemedScrollView>
        <ThemedInput label="Tracker name" value={name} onChangeText={setName} />
        <ThemedInput label="Description/Question (optional)" value={description} onChangeText={setDescription} />
        <ThemedToggleButtons
          label="Value type"
          columns={2}
          options={Object.values(trackerNames)}
          onChangeSelection={(option) => setType(option as TrackerType)}
        />
      </ThemedScrollView>
      <View style={styles.submitButtonContainer}>
        <ThemedButton fullWidth title="Create tracker" onPress={handleSubmit} />
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

import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedInput from "@/components/ThemedInput";
import { useState } from "react";
import ThemedToggleButtons from "@/components/ThemedToggleButtons";
import { StyleSheet, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { trackerNames, trackerNamesToType, trackersTable, type NewTracker, type TrackerType } from "@/db/schema";
import { db } from "@/db";
import { useRouter } from "expo-router";

export default function AddTrackerScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<TrackerType | null>(null);
  const [suffix, setSuffix] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [scaleMin, setScaleMin] = useState<number | null>(null);
  const [scaleMax, setScaleMax] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!type || !name) {
      throw new Error("Missing data");
    }
    const nextIndex = await db
      .select({
        index: trackersTable.index,
      })
      .from(trackersTable)
      .orderBy(trackersTable.index)
      .limit(1);

    const tracker: NewTracker = {
      name,
      type,
      description,
      prefix,
      suffix,
      index: (nextIndex?.[0]?.index ?? 0) + 1,
    };
    await db.insert(trackersTable).values(tracker);
    router.back();
  };

  return (
    <ThemedView>
      <ThemedScrollView>
        <ThemedInput autoCapitalize="sentences" label="Tracker name" value={name} onChangeText={setName} />
        <ThemedInput
          autoCapitalize="sentences"
          label="Description/Question (optional)"
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.prefixSuffix}>
          <ThemedInput style={styles.flex1} label="Prefix (optional)" value={prefix} onChangeText={setPrefix} />
          <ThemedInput style={styles.flex1} label="Suffix (optional)" value={suffix} onChangeText={setSuffix} />
        </View>
        <ThemedToggleButtons
          label="Value type"
          columns={2}
          options={Object.values(trackerNames)}
          onChangeSelection={(option) => setType(trackerNamesToType[option])}
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
  prefixSuffix: {
    flexDirection: "row",
    gap: Sizes.small,
  },
  flex1: {
    flex: 1,
  },
});

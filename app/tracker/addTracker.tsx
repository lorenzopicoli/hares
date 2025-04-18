import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedInput from "@/components/ThemedInput";
import { useState } from "react";
import ThemedToggleButtons from "@/components/ThemedToggleButtons";
import { StyleSheet, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { trackerNames, trackerNamesToType, TrackerType, type NewTracker } from "@/db/schema";
import { useRouter } from "expo-router";
import { useCreateTracker } from "@/hooks/data/useCreateTracker";

export default function AddTrackerScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<TrackerType | null>(null);
  const [suffix, setSuffix] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [rangeMin, setRangeMin] = useState<string>("");
  const [rangeMax, setRangeMax] = useState<string>("");

  const { createTracker } = useCreateTracker();

  const handleTypeChange = (option: string) => {
    setType(trackerNamesToType[option]);
  };

  const handleSubmit = async () => {
    if (!type || !name) {
      throw new Error("Missing data");
    }

    const tracker: Omit<NewTracker, "index"> = {
      name,
      type,
      description,
      prefix,
      suffix,
      rangeMax: rangeMax === "" ? null : +rangeMax || null,
      rangeMin: rangeMin === "" ? null : +rangeMin || null,
    };
    await createTracker(tracker);
    router.dismiss();
  };

  return (
    <ThemedView>
      <ThemedScrollView keyboardShouldPersistTaps>
        <ThemedInput autoCapitalize="sentences" label="Tracker name" value={name} onChangeText={setName} />
        <ThemedInput
          autoCapitalize="sentences"
          label="Description/Question (optional)"
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.sideBySide}>
          <ThemedInput style={styles.flex1} label="Prefix (optional)" value={prefix} onChangeText={setPrefix} />
          <ThemedInput style={styles.flex1} label="Suffix (optional)" value={suffix} onChangeText={setSuffix} />
        </View>
        <ThemedToggleButtons
          label="Value type"
          columns={2}
          options={Object.values(trackerNames)}
          onChangeSelection={handleTypeChange}
        />

        {type === TrackerType.Scale ? (
          <View style={styles.sideBySide}>
            <ThemedInput style={styles.flex1} label="Range min" value={prefix} onChangeText={setRangeMin} />
            <ThemedInput style={styles.flex1} label="Range max" value={suffix} onChangeText={setRangeMax} />
          </View>
        ) : null}
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
  sideBySide: {
    flexDirection: "row",
    gap: Sizes.small,
  },
  flex1: {
    flex: 1,
  },
});

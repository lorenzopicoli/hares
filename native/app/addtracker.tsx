import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedInput from "@/components/ThemedInput";
import { useState } from "react";
import type { TrackerType } from "@/models/tracker";
import ThemedToggleButtons from "@/components/ThemedToggleButtons";
import { StyleSheet } from "react-native";

export default function AddTrackerScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<TrackerType | null>(null);
  const [scaleMin, setScaleMin] = useState<number | null>(null);
  const [scaleMax, setScaleMax] = useState<number | null>(null);
  const [textGroup, setTextGroup] = useState<string | null>(null);

  return (
    <ThemedScrollView>
      <ThemedInput label="Tracker name" value={name} onChangeText={setName} />
      <ThemedInput label="Description/Question (optional)" value={description} onChangeText={setDescription} />
      <ThemedToggleButtons label="Value type" columns={2} options={["Number", "Text", "Yes/No", "Range"]} />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({});

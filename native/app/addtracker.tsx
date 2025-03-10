import { StyleSheet } from "react-native";
import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedInput from "@/components/ThemedInput";
import { useState } from "react";
import type { TrackerType } from "@/models/tracker";
import { Picker } from "@react-native-picker/picker";

export default function AddTrackerScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<TrackerType | null>(null);
  const [scaleMin, setScaleMin] = useState<number | null>(null);
  const [scaleMax, setScaleMax] = useState<number | null>(null);
  const [textGroup, setTextGroup] = useState<string | null>(null);

  return (
    <ThemedScrollView>
      <ThemedInput
        label="Tracker name"
        value={name}
        onChangeText={(text) => {
          console.log(text);
        }}
      />
      <ThemedInput
        label="Description"
        value={description}
        onChangeText={(text) => {
          console.log(text);
        }}
      />
      <Picker selectedValue={type} onValueChange={(itemValue, itemIndex) => setType(itemValue)}>
        <Picker.Item label="Number" value="number" />
        <Picker.Item label="Scale" value="scale" />
        <Picker.Item label="Yes or no" value="boolean" />
        <Picker.Item label="List" value="textList" />
      </Picker>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({});

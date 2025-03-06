import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedInput from "@/components/ThemedInput";

export default function TabTwoScreen() {
  return (
    <ThemedScrollView>
      <ThemedInput
        label="Label"
        value="Bla"
        onChangeText={(text) => {
          console.log(text);
        }}
      />
      <ThemedText>This app includes example code to help you get started.</ThemedText>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({});

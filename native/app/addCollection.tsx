import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedInput from "@/components/ThemedInput";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { collectionsTable, type NewCollection } from "@/db/schema";
import { db } from "@/db";
import { router } from "expo-router";

export default function AddCollectionScreen() {
  const [name, setName] = useState("");

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

  return (
    <ThemedView>
      <ThemedScrollView>
        <ThemedInput label="Collection name" value={name} onChangeText={setName} />
      </ThemedScrollView>
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

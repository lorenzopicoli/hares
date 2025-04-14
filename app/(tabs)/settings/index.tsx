import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ThemedScrollView from "@/components/ThemedScrollView";
import * as SQLite from "expo-sqlite";
import ThemedButton from "@/components/ThemedButton";
import { useDatabase } from "@/contexts/DatabaseContext";
import { DB_NAME } from "@/db/schema";

export default function SettingsScreen() {
  const { db } = useDatabase();
  return (
    <ThemedScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedButton
        onPress={() => {
          try {
            db.$client.closeSync();
          } catch (err) {
            console.log("Error closing connection, maybe already closed?", err);
          }
          try {
            SQLite.deleteDatabaseSync(DB_NAME);
          } catch (err) {
            console.log("Error deleting DB, maybe doesn't exist?", err);
          }
        }}
        title="Delete all data"
      />
      <ThemedText>This app includes example code to help you get started.</ThemedText>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

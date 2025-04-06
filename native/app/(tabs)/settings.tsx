import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ThemedScrollView from "@/components/ThemedScrollView";
import * as SQLite from "expo-sqlite";
import ThemedButton from "@/components/ThemedButton";
import { dbConn, dbName } from "@/db";

export default function TabTwoScreen() {
  return (
    <ThemedScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedButton
        onPress={() => {
          try {
            dbConn.closeSync();
          } catch (err) {
            console.log("Error closing connection, maybe already closed?", err);
          }
          try {
            SQLite.deleteDatabaseSync(dbName);
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

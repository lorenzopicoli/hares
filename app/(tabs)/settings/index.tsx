import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ThemedScrollView from "@/components/ThemedScrollView";
import * as SQLite from "expo-sqlite";
import ThemedButton from "@/components/ThemedButton";
import { useDatabase } from "@/contexts/DatabaseContext";
import { DB_NAME } from "@/db/schema";
import { useConfirmModal } from "@/hooks/useConfirmModal";

export default function SettingsScreen() {
  const { db } = useDatabase();
  const { confirm, ConfirmModal } = useConfirmModal();
  return (
    <ThemedScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Data</ThemedText>
      </ThemedView>
      <ThemedButton
        onPress={async () => {
          const confirmed = await confirm({
            confirmText: "I'm sure",
            dismissText: "Cancel",
            title: "Are you sure?",
            description:
              "Deleting your data is not reversible and it'll be gone forever.\nYou should restart the app after.",
          });

          if (!confirmed) {
            return;
          }

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
      {ConfirmModal}
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

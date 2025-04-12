import { FlatList, StyleSheet, View } from "react-native";
import SearchInput from "@/components/SearchInput";
import { Separator } from "@/components/Separator";
import { ThemedView } from "@/components/ThemedView";
import { db } from "@/db";
import { entriesTable, textListEntriesTable, type TrackerEntry } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useState } from "react";
import { useColors, type ThemedColors } from "@/components/ThemeProvider";
import EntriesListRow from "@/components/EntriesList/EntriesListRow";
import { useActionSheet } from "@expo/react-native-action-sheet";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";

export default function EntriesScreen() {
  const { colors } = useColors();
  const { styles } = useStyles(createStyles);
  const [searchText, setSearchText] = useState<string>("");
  const { showActionSheetWithOptions } = useActionSheet();
  const { data: entries } = useLiveQuery(
    db.query.entriesTable.findMany({
      orderBy: desc(entriesTable.date),
      with: {
        textListValues: true,
        tracker: true,
      },
    }),
    [searchText],
  );

  const handleEntryPress = (entry: TrackerEntry) => {
    const options = ["Edit", "Delete", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    const dangerButtonIndex = options.length - 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex: dangerButtonIndex,
        containerStyle: { backgroundColor: colors.background },
        textStyle: { color: colors.text },
      },
      async (selectedIndex?: number) => {
        switch (selectedIndex) {
          case 0:
            console.log("Edit");
            break;

          case 1:
            await db.delete(textListEntriesTable).where(eq(textListEntriesTable.entryId, entry.id));
            await db.delete(entriesTable).where(eq(entriesTable.id, entry.id));
            break;

          case 2:
            break;

          default:
        }
      },
    );
  };

  const renderItem = ({ item }: { item: TrackerEntry }) => {
    return <EntriesListRow entry={item} onPress={handleEntryPress} />;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchText}
          onChange={(text) => {
            setSearchText(text);
          }}
          placeholder="Search..."
        />
      </View>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyboardShouldPersistTaps="always"
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={Separator}
      />
    </ThemedView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {},
    searchContainer: {
      paddingHorizontal: Sizes.small,
    },
  });

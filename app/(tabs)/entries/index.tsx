import { FlatList, StyleSheet, View } from "react-native";
import SearchInput from "@/components/SearchInput";
import { Separator } from "@/components/Separator";
import { ThemedView } from "@/components/ThemedView";
import type { TrackerEntry } from "@/db/schema";
import { useState } from "react";
import type { ThemedColors } from "@/components/ThemeProvider";
import EntriesListRow from "@/components/EntriesList/EntriesListRow";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";
import { useEntries } from "@/hooks/data/useEntries";
import { useEntryActions } from "@/hooks/useEntryActions";

export default function EntriesScreen() {
  const { styles } = useStyles(createStyles);
  const [searchText, setSearchText] = useState<string>("");
  const { entries } = useEntries(searchText);
  const { handleEntryActions } = useEntryActions();

  const renderItem = ({ item }: { item: TrackerEntry }) => {
    return <EntriesListRow entry={item} onPress={handleEntryActions} />;
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

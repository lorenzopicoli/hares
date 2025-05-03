import { FlatList, Platform, StyleSheet, View } from "react-native";
import SearchInput from "@/components/SearchInput";
import { Separator } from "@/components/Separator";
import { ThemedView } from "@/components/ThemedView";
import type { TrackerEntry } from "@/db/schema";
import { useEffect, useRef, useState } from "react";
import type { ThemedColors } from "@/components/ThemeProvider";
import EntriesListRow from "@/components/EntriesList/EntriesListRow";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";
import { useEntries } from "@/hooks/data/useEntries";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  EntryOptionsBottomSheet,
  type EntryOptionsBottomSheetRef,
} from "@/components/BottomSheets/EntryOptionsBottomSheet";
import EmptyState from "@/components/EmptyState";

export default function EntriesScreen() {
  const { styles } = useStyles(createStyles);
  const router = useRouter();
  const { searchText: searchTextParam } = useLocalSearchParams<{
    searchText?: string;
  }>();
  const [searchText, setSearchText] = useState<string>(searchTextParam ?? "");
  const { entries } = useEntries({ searchText });
  const entryOptionsBottomSheetRef = useRef<EntryOptionsBottomSheetRef>(null);

  useEffect(() => {
    if (searchTextParam) {
      setSearchText(searchTextParam);
    }
  }, [searchTextParam]);

  const renderItem = ({ item }: { item: TrackerEntry }) => {
    const handlePress = () => {
      entryOptionsBottomSheetRef.current?.presentWithEntryId(item.id, item.trackerId);
    };
    return <EntriesListRow style={styles.listItem} entry={item} onPress={handlePress} />;
  };

  return (
    <ThemedView>
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchText}
          onChange={(text) => {
            setSearchText(text);
            router.setParams({ searchText: "" });
          }}
          placeholder="Search..."
        />
      </View>
      {entries ? (
        <ThemedView style={styles.listContainer}>
          <FlatList
            data={entries}
            renderItem={renderItem}
            keyboardShouldPersistTaps={Platform.OS === "android" ? "always" : undefined}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={Separator}
          />
        </ThemedView>
      ) : (
        <ThemedView>
          <EmptyState title="No entries yet" subTitle="Add an entry by selecting a tracker in the 'Track' page" />
        </ThemedView>
      )}
      <EntryOptionsBottomSheet ref={entryOptionsBottomSheetRef} />
    </ThemedView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    listContainer: {
      paddingVertical: Sizes.small,
    },
    listItem: {
      padding: Sizes.medium,
    },
    searchContainer: {
      paddingHorizontal: Sizes.small,
    },
  });

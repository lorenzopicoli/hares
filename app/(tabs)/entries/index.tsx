import { FlatList, Platform, StyleSheet, View } from "react-native";
import SearchInput from "@/components/SearchInput";
import { Separator } from "@/components/Separator";
import { ThemedView } from "@/components/ThemedView";
import type { TrackerEntry } from "@/db/schema";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ThemedColors } from "@/contexts/ThemeContext";
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
  const [limit, setLimit] = useState(50);
  const [searchText, setSearchText] = useState<string>(searchTextParam ?? "");
  const { entries } = useEntries({ searchText, limit });
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

  const handleOnEndReached = useCallback(() => {
    setLimit((prev) => prev + 50);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View>
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
        <ThemedView>
          <FlatList
            data={entries}
            renderItem={renderItem}
            keyboardShouldPersistTaps={Platform.OS === "android" ? "always" : undefined}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <Separator overrideHorizontalMargin={0} />}
            onEndReached={handleOnEndReached}
            onEndReachedThreshold={0.8}
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
      paddingVertical: Sizes.medium,
    },
    listItem: {
      paddingVertical: Sizes.medium,
    },
    container: {
      paddingHorizontal: Sizes.medium,
    },
  });

import SearchInput from "@/components/SearchInput";
import { Separator } from "@/components/Separator";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import type { ThemedColors } from "@/components/ThemeProvider";
import { Sizes } from "@/constants/Sizes";
import { useEntryTextList } from "@/hooks/data/useEntryTextList";
import useStyles from "@/hooks/useStyles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, FlatList, TouchableOpacity, Platform } from "react-native";

export default function TextListSelectionScreen() {
  const {
    trackerId,
    entryId,
    preSelectedItems = "[]",
  } = useLocalSearchParams<{
    trackerId: string;
    entryId?: string;
    preSelectedItems?: string;
  }>();
  const { styles } = useStyles(createStyles);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<Map<string, boolean>>(
    new Map(JSON.parse(preSelectedItems).map((item: string) => [item, true])),
  );

  const { textListEntries } = useEntryTextList({ trackerId: +trackerId, searchQuery });
  const data = useMemo(
    () => [
      ...Array.from(selectedItems, ([value, _label]) => value),
      ...textListEntries.filter((d) => !selectedItems.has(d.name)).map((v) => v.name),
    ],
    [selectedItems, textListEntries],
  );

  const handleDone = () => {
    router.dismissTo({
      pathname: "/entry/addEntry",
      params: {
        entryId,
        trackerId,
        textListSelections: JSON.stringify(Array.from(selectedItems, ([value, _label]) => value)),
      },
    });
  };

  const toggleItem = (item: string) => {
    const newMap = new Map(selectedItems);
    const contained = newMap.delete(item);
    if (contained) {
      setSelectedItems(newMap);
    } else {
      newMap.set(item, true);
      setSelectedItems(newMap);
    }
    setSearchQuery("");
  };

  const handleAdd = () => {
    if (searchQuery) {
      toggleItem(searchQuery);
    } else {
      handleDone();
    }
  };

  const renderItem = ({ item }: { item: string }) => {
    const handlePress = () => {
      toggleItem(item);
    };
    return (
      <TouchableOpacity onPress={handlePress}>
        <ThemedView style={styles.itemInnerContainer}>
          <ThemedText>{item}</ThemedText>
          {selectedItems.has(item) ? <Ionicons style={styles.itemIcon} name="checkmark" size={20} /> : null}
        </ThemedView>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <SearchInput value={searchQuery} onChange={setSearchQuery} autoCapitalize="words" autoFocus />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyboardShouldPersistTaps={Platform.OS === "android" ? "always" : undefined}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={Separator}
      />
      <ThemedButton title={searchQuery ? `Add ${searchQuery}` : "Done"} onPress={handleAdd} />
    </ThemedSafeAreaView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: Sizes.small,
    },
    itemInnerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: Sizes.list.medium,
      paddingHorizontal: Sizes.medium,
    },
    itemIcon: {
      color: theme.tint,
    },
  });

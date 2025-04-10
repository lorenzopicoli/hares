import SearchInput from "@/components/SearchInput";
import { Separator } from "@/components/Separator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { ThemedColors } from "@/components/ThemeProvider";
import { Sizes } from "@/constants/Sizes";
import useStyles from "@/hooks/useStyles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
const _data = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
  { label: "Item 9", value: "9" },
  { label: "Item 10", value: "10" },
  { label: "Item 11", value: "11" },
  { label: "Item 12", value: "12" },
  { label: "Item 13", value: "13" },
  { label: "Item 14", value: "14" },
  { label: "Item 15", value: "15" },
  { label: "Item 16", value: "16" },
  { label: "Item 17", value: "17" },
  { label: "Item 18", value: "18" },
  { label: "Item 19", value: "19" },
  { label: "Item 20", value: "20" },
  { label: "Item 21", value: "21" },
  { label: "Item 22", value: "22" },
  { label: "Item 23", value: "23" },
  { label: "Item 24", value: "24" },
  { label: "Item 25", value: "25" },
  { label: "Item 26", value: "26" },
  { label: "Item 27", value: "27" },
  { label: "Item 28", value: "28" },
  { label: "Item 29", value: "29" },
  { label: "Item 30", value: "30" },
  { label: "Item 31", value: "31" },
  { label: "Item 32", value: "32" },
  { label: "Item 33", value: "33" },
  { label: "Item 34", value: "34" },
  { label: "Item 35", value: "35" },
  { label: "Item 36", value: "36" },
  { label: "Item 37", value: "37" },
  { label: "Item 38", value: "38" },
  { label: "Item 39", value: "39" },
  { label: "Item 40", value: "40" },
  { label: "Item 41", value: "41" },
  { label: "Item 42", value: "42" },
  { label: "Item 43", value: "43" },
  { label: "Item 44", value: "44" },
  { label: "Item 45", value: "45" },
  { label: "Item 46", value: "46" },
  { label: "Item 47", value: "47" },
  { label: "Item 48", value: "48" },
  { label: "Item 49", value: "49" },
  { label: "Item 50", value: "50" },
];

export default function TextListSelectionScreen() {
  const { trackerId } = useLocalSearchParams<{ trackerId: string }>();
  const { styles } = useStyles(createStyles);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<Map<string, string>>(new Map());

  const toggleItem = (item: { label: string; value: string }) => {
    const newMap = new Map(selectedItems);
    const contained = newMap.delete(item.value);
    if (contained) {
      setSelectedItems(newMap);
    } else {
      newMap.set(item.value, item.label);
      setSelectedItems(newMap);
    }
  };

  // Yikes, need to change this
  const data = useMemo(
    () => [
      ...Array.from(selectedItems, ([value, label]) => ({
        value,
        label,
      })),
      ..._data.filter((d) => !selectedItems.has(d.value)),
    ],
    [selectedItems],
  );

  const renderItem = ({ item }: { item: { label: string; value: string } }) => {
    return (
      <TouchableOpacity onPress={() => toggleItem(item)}>
        <ThemedView style={styles.itemInnerContainer}>
          <ThemedText>{item.label}</ThemedText>
          {selectedItems.has(item.value) ? <Ionicons style={styles.itemIcon} name="checkmark" size={20} /> : null}
        </ThemedView>
        <Separator />
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView>
      <SearchInput
        value={searchText}
        onChange={(text) => {
          setSearchText(text);
        }}
        autoFocus
        placeholder="Search..."
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyboardShouldPersistTaps="always"
        keyExtractor={(item) => item.value}
        ItemSeparatorComponent={Separator}
      />
    </ThemedView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {},
    dropdown: {
      height: 50,
      borderRadius: Sizes.radius.small,
      borderBottomColor: theme.border,
      borderBottomWidth: 0.5,
      color: theme.text,
      backgroundColor: theme.input.background,
      marginBottom: Sizes.medium,
    },
    itemInnerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Sizes.medium,
      height: Sizes.list.medium,
    },
    itemIcon: {
      color: theme.tint,
    },
    placeholderStyle: {
      fontSize: 16,
      color: theme.secondaryText,
      marginLeft: Sizes.medium,
    },
    iconStyle: {
      width: 25,
      height: 25,
      marginRight: Sizes.small,
    },
    dropdownContainer: {
      backgroundColor: theme.input.background,
      borderColor: theme.input.background,
      borderRadius: Sizes.radius.small,
    },
    selectedStyle: {
      borderRadius: 12,
      backgroundColor: theme.background,
    },
    selectedTextStyle: {
      fontSize: 14,
      color: theme.text,
    },
  });

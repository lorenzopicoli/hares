import SearchInput from "@/components/SearchInput";
import { Separator } from "@/components/Separator";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import type { ThemedColors } from "@/components/ThemeProvider";
import { Sizes } from "@/constants/Sizes";
import { useEntryTextList } from "@/hooks/data/useEntryTextList";
import useStyles from "@/hooks/useStyles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, FlatList, TouchableOpacity, View } from "react-native";

export default function TextListSelectionScreen() {
  const { trackerId, preSelectedItems = "[]" } = useLocalSearchParams<{
    trackerId: string;
    preSelectedItems?: string;
  }>();
  const { styles } = useStyles(createStyles);
  const router = useRouter();
  const navigation = useNavigation();

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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          {/* On press in because of: https://github.com/expo/expo/issues/29489 */}
          <TouchableOpacity
            onPressIn={() => {
              router.dismissTo({
                pathname: "/entry/addEntry",
                params: {
                  trackerId: trackerId,
                  textListSelections: JSON.stringify(Array.from(selectedItems, ([value, _label]) => value)),
                },
              });
            }}
          >
            <ThemedText>Done</ThemedText>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, router, trackerId, selectedItems]);

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
        <Separator />
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView>
      <SearchInput value={searchQuery} onChange={setSearchQuery} autoFocus placeholder="Search..." />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyboardShouldPersistTaps="always"
        keyExtractor={(item) => item}
        ItemSeparatorComponent={Separator}
      />
      <ThemedButton disabled={searchQuery === ""} title={`Add ${searchQuery}`} onPress={handleAdd} />
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

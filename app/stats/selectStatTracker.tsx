import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import SearchInput from "@/components/SearchInput";
import { Separator } from "@/components/Separator";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import type { Tracker } from "@/db/schema";
import { useState } from "react";
import type { ThemedColors } from "@/contexts/ThemeContext";
import useStyles from "@/hooks/useStyles";
import { Sizes } from "@/constants/Sizes";
import { useTrackers } from "@/hooks/data/useTrackers";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";

export default function SelectStatTrackerScreen() {
  const { styles } = useStyles(createStyles);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { trackers } = useTrackers({ searchQuery });
  const router = useRouter();

  const renderItem = ({ item }: { item: Tracker }) => {
    const handleSelectTracker = () => {
      router.dismissTo({ pathname: "/(tabs)/stats", params: { trackerId: item.id } });
    };
    return (
      <TouchableOpacity style={styles.listItem} onPress={handleSelectTracker}>
        <ThemedText>{item.name}</ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedSafeAreaView>
      <ThemedView>
        <View style={styles.searchContainer}>
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search..." />
        </View>
        <ThemedView style={styles.listContainer}>
          <FlatList
            data={trackers}
            renderItem={renderItem}
            keyboardShouldPersistTaps="always"
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={Separator}
          />
        </ThemedView>
      </ThemedView>
    </ThemedSafeAreaView>
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

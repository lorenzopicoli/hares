import useStyles from "@/hooks/useStyles";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useColors, type ThemedColors } from "../ThemeProvider";
import { ThemedView } from "../ThemedView";
import { MultiSelect } from "react-native-element-dropdown";
import SearchInput from "../SearchInput";
import { Sizes } from "@/constants/Sizes";
import { Separator } from "../Separator";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";

export interface TextListInputProps {
  onChange?: (values: string[]) => void;
  data: { label: string; value: string }[];
}

export default function TextListInput(props: TextListInputProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const { styles } = useStyles(createStyles);
  const [searchText, setSearchText] = useState<string>("");
  const { colors } = useColors();

  const handleSelectItem = (item: string[]) => {
    setSelected(item);
    props.onChange?.(selected);
  };

  const renderInputSearch = (onSearch: (text: string) => void) => {
    return (
      <>
        <SearchInput
          value={searchText}
          onChange={(text) => {
            setSearchText(text);
            onSearch(text);
          }}
          autoFocus
          placeholder="Search..."
        />
        <Separator />
      </>
    );
  };

  const renderItem = (item: { label: string; value: string }, selected?: boolean) => {
    return (
      <View>
        <View style={styles.itemInnerContainer}>
          <ThemedText>{item.label}</ThemedText>
          {selected && <Ionicons style={styles.itemIcon} name="checkmark" size={20} />}
        </View>
        <Separator />
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <MultiSelect
        style={styles.dropdown}
        mode="default"
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholderStyle}
        activeColor={colors.input.background}
        iconStyle={styles.iconStyle}
        renderItem={renderItem}
        search
        onBlur={() => setSearchText("")}
        renderInputSearch={renderInputSearch}
        data={props.data}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={selected}
        onChange={handleSelectItem}
        selectedStyle={styles.selectedStyle}
        selectedTextStyle={styles.selectedTextStyle}
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

import React, { useEffect, useRef } from "react";
import { TextInput, View, StyleSheet, type StyleProp, type TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useStyles from "@/hooks/useStyles";
import { useColors, type ThemedColors } from "./ThemeProvider";
import { Sizes } from "@/constants/Sizes";

interface SearchInputProps {
  value: string;
  onChange: (text: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
}

function SearchInput(props: SearchInputProps) {
  const { autoFocus, value, onChange, placeholder = "Search...", style } = props;
  const inputRef = useRef<TextInput>(null);
  const { colors } = useColors();
  const { styles: customStyles } = useStyles(createSearchStyles);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current && autoFocus) {
        inputRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [autoFocus]);

  return (
    <View style={customStyles.searchContainer}>
      <Ionicons name="search" size={20} color={colors.secondaryText} style={customStyles.searchIcon} />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        style={[customStyles.searchInput, style]}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Ionicons
          name="close-circle"
          size={20}
          color={colors.secondaryText}
          style={customStyles.clearIcon}
          onPress={() => onChange("")}
        />
      )}
    </View>
  );
}

const createSearchStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: Sizes.radius.small,
      paddingHorizontal: Sizes.small,
      height: Sizes.inputHeight,
      marginHorizontal: 2,
      marginVertical: Sizes.small,
      backgroundColor: theme.input.background,
    },
    searchIcon: {
      marginRight: Sizes.small,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      height: "100%",
      padding: 0,
    },
    clearIcon: {
      padding: Sizes.xSmall,
    },
  });

export default SearchInput;

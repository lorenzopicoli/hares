import React, { useEffect, useRef } from "react";
import { TextInput, View, StyleSheet, type StyleProp, type TextStyle, type TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useStyles from "@/hooks/useStyles";
import { useColors, type ThemedColors } from "@/contexts/ThemeContext";
import { Sizes } from "@/constants/Sizes";
import { Fonts } from "@/constants/Colors";

interface SearchInputProps {
  value: string;
  editable?: boolean;
  onChange?: (text: string) => void;
  onFocus?: () => void;
  hideClose?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  onPress?: () => void;
}

function SearchInput(props: SearchInputProps) {
  const {
    editable = true,
    hideClose,
    autoFocus,
    value,
    onPress,
    onChange,
    onFocus,
    placeholder = "Search...",
    autoCapitalize,
    style,
  } = props;
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
        onPress={onPress}
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        style={[customStyles.searchInput, style]}
        autoCapitalize={autoCapitalize ?? "none"}
        autoCorrect={false}
        returnKeyType="search"
        editable={editable}
      />
      {!hideClose && value.length > 0 && (
        <Ionicons
          name="close-circle"
          size={20}
          color={colors.secondaryText}
          style={customStyles.clearIcon}
          onPress={() => onChange?.("")}
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
      borderWidth: 1,
      borderColor: theme.input.border,
      borderRadius: Sizes.radius.small,
      paddingHorizontal: Sizes.small,
      height: Sizes.inputHeight,
      marginVertical: Sizes.small,
      backgroundColor: theme.input.background,
    },
    searchIcon: {
      marginRight: Sizes.small,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      ...Fonts.regular,
      color: theme.text,
      height: "100%",
      padding: 0,
    },
    clearIcon: {
      padding: Sizes.xSmall,
    },
  });

export default SearchInput;

import React from "react";
import { StyleSheet, TouchableOpacity, View, type StyleProp, type ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";
import { useColors } from "./ThemeProvider";
import { Sizes } from "@/constants/Sizes";
import { Feather } from "@expo/vector-icons";

interface ChipProps {
  label: string;
  onPress?: () => void;
  showDelete?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface ChipGroupProps {
  chips: ChipData[];
  onChipPress?: (chip: ChipData, index: number) => void;
  showDelete?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface ChipData {
  id: string | number;
  label: string;
  disabled?: boolean;
}

function Chip(props: ChipProps) {
  const { label, onPress, showDelete, disabled = false, style } = props;
  const { colors } = useColors();
  const styles = createChipStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.chip, disabled && styles.chipDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <ThemedText style={[styles.label, disabled && styles.labelDisabled]} type="defaultSemiBold">
        {label}
      </ThemedText>

      {showDelete && <Feather style={styles.icon} size={15} name="x" />}
    </TouchableOpacity>
  );
}

export function ChipGroup(props: ChipGroupProps) {
  const { chips, onChipPress, showDelete, style } = props;
  const { colors } = useColors();
  const styles = createChipGroupStyles(colors);

  return (
    <View style={[styles.container, style]}>
      {chips.map((chip, index) => (
        <Chip
          showDelete={showDelete}
          key={chip.id.toString()}
          label={chip.label}
          disabled={chip.disabled}
          onPress={() => onChipPress?.(chip, index)}
          style={styles.chipMargin}
        />
      ))}
    </View>
  );
}

const createChipStyles = (theme: ReturnType<typeof useColors>["colors"]) =>
  StyleSheet.create({
    chip: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.darkTint,
      borderRadius: Sizes.radius.pill,
      borderWidth: 1,
      borderColor: theme.toggleButton.border,
      paddingHorizontal: Sizes.small,
      paddingVertical: Sizes.small,
      gap: Sizes.small,
    },
    chipDisabled: {
      backgroundColor: theme.input.backgroundDisabled,
      borderColor: theme.input.border,
    },
    label: {
      lineHeight: 14,
      textAlign: "center",
      fontSize: 12,
      color: theme.text,
    },
    labelDisabled: {
      color: theme.secondaryText,
    },
    icon: {
      color: theme.text,
    },
  });

const createChipGroupStyles = (theme: ReturnType<typeof useColors>["colors"]) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    chipMargin: {
      margin: Sizes.xSmall,
    },
  });

import useStyles from "@/hooks/useStyles";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useColors, type ThemedColors } from "../ThemeProvider";
import Slider from "@react-native-community/slider";
import { ThemedText } from "../ThemedText";
import { Sizes } from "@/constants/Sizes";
import { ThemedView } from "../ThemedView";

export interface EntrySliderInputProps {
  onChange?: (value: number | null) => void;
  min: number;
  max: number;
}

// TODO: the slider component I use here is so hard to press, should build a custom version since
// the lib is not customizable
// TODO: should probably allow for manual value entering
export default function EntrySliderInput(props: EntrySliderInputProps) {
  const [numberValue, setNumberValue] = useState<number | null>(0);
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();

  const handleSliderChange = (value: number) => {
    setNumberValue(value);
  };

  useEffect(() => {
    props.onChange?.(numberValue);
  }, [numberValue, props.onChange]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.currentValue}>{numberValue}</ThemedText>
      <ThemedView style={styles.sliderContainer}>
        <ThemedText>{props.min}</ThemedText>
        <Slider
          style={styles.slider}
          step={1}
          minimumValue={props.min}
          maximumValue={props.max}
          minimumTrackTintColor={colors.tint}
          thumbTintColor={colors.tint}
          maximumTrackTintColor="#FFFFFF"
          onValueChange={handleSliderChange}
          hitSlop={{ top: 40, bottom: 40, left: 40, right: 40 }}
        />
        <ThemedText>{props.max}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    sliderContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: Sizes.small,
    },
    slider: {
      flex: 1,
    },
    currentValue: {
      color: theme.input.text,
      fontSize: 70,
      lineHeight: 70,
      fontWeight: 600,
    },
    container: {
      alignItems: "center",
    },
  });

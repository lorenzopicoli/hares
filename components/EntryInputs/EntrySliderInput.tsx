import useStyles from "@/hooks/useStyles";
import { StyleSheet } from "react-native";
import { useColors, type ThemedColors } from "../ThemeProvider";
import { ThemedText } from "../ThemedText";
import { Sizes } from "@/constants/Sizes";
import { ThemedView } from "../ThemedView";
import { type FieldValues, type Path, type ControllerProps, Controller } from "react-hook-form";
import EntryNumberInput from "./EntryNumberInput";
import Slider from "@react-native-community/slider";

export interface EntrySliderInputProps {
  onChange?: (value: number | null) => void;
  value?: number | null;
  min: number;
  max: number;
  prefix?: string | null;
  suffix?: string | null;
  error?: string;
}

interface FormEntryNumberInputProps<T extends FieldValues, K extends Path<T>> extends EntrySliderInputProps {
  form: Omit<ControllerProps<T, K, T>, "render">;
}

export function FormEntrySliderInput<T extends FieldValues, K extends Path<T>>(props: FormEntryNumberInputProps<T, K>) {
  const { form, ...inputProps } = props;

  return (
    <Controller
      {...form}
      render={({ field: { onChange, value }, fieldState }) => {
        return <EntrySliderInput {...inputProps} onChange={onChange} value={value} error={fieldState.error?.message} />;
      }}
    />
  );
}

// TODO: the slider component I use here is so hard to press, should build a custom version since
// the lib is not customizable
// TODO: should probably allow for manual value entering
export default function EntrySliderInput(props: EntrySliderInputProps) {
  const { styles } = useStyles(createStyles);
  const { colors } = useColors();

  return (
    <ThemedView style={styles.container}>
      <EntryNumberInput
        containerStyle={styles.numberInput}
        showCounterButtons={false}
        value={props.value}
        prefix={props.prefix}
        suffix={props.suffix}
        minValue={props.min}
        maxValue={props.max}
        onChangeText={props.onChange}
      />
      <ThemedView style={styles.sliderContainer}>
        <ThemedText>{props.min}</ThemedText>
        <Slider
          style={styles.slider}
          step={1}
          minimumValue={props.min}
          maximumValue={props.max}
          minimumTrackTintColor={colors.tint}
          thumbTintColor={colors.tint}
          maximumTrackTintColor={colors.text}
          value={props.value ?? undefined}
          onValueChange={props.onChange}
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
    numberInput: {
      flexShrink: 1,
    },
  });

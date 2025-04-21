import React, { useMemo, useState, type PropsWithChildren } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import { Sizes } from "@/constants/Sizes";
import ThemedInputLabel from "./ThemedInputLabel";
import { Controller, type ControllerProps, type FieldValues, type Path } from "react-hook-form";
import InputErrorLabel from "./InputErrorLabel";

interface Option<V> {
  value: V;
  label: string;
}

interface ThemedToggleButtonsProps<V> {
  options: Option<V>[];
  columns: number;
  label?: string;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  selectedOption?: V | null;
  onChangeSelection?: (option: V | null) => void;
  error?: string;
  allowUnselect?: boolean;
}

interface FormThemedToggleButtonsProps<T extends FieldValues, K extends Path<T>, V>
  extends ThemedToggleButtonsProps<V> {
  form: Omit<ControllerProps<T, K, T>, "render">;
}

export function FormThemedToggleButtons<T extends FieldValues, K extends Path<T>, V>(
  props: FormThemedToggleButtonsProps<T, K, V>,
) {
  const { form, ...inputProps } = props;

  return (
    <Controller
      {...form}
      render={({ field: { onChange, value }, fieldState }) => {
        return (
          <ThemedToggleButtons
            {...inputProps}
            onChangeSelection={onChange}
            selectedOption={value}
            error={fieldState.error?.message}
          />
        );
      }}
    />
  );
}

function ThemedToggleButtons<V>(props: ThemedToggleButtonsProps<V>) {
  const {
    options,
    columns,
    label,
    onChangeSelection,
    buttonContainerStyle,
    selectedOption: controlledSelectedOption,
    allowUnselect = false,
    error,
  } = props;
  const { styles } = useStyles(createStyles);
  const [internalSelectedOption, setInternalSelectedOption] = useState<V | null>(null);
  const isControlled = controlledSelectedOption !== undefined;
  const selectedOption = useMemo(() => {
    if (isControlled) {
      return controlledSelectedOption;
    }
    return internalSelectedOption;
  }, [internalSelectedOption, controlledSelectedOption, isControlled]);

  const handleSelectOption = (optionParam: V) => () => {
    const option = optionParam === selectedOption && allowUnselect ? null : optionParam;
    if (!isControlled) {
      setInternalSelectedOption(option);
    }
    onChangeSelection?.(option);
  };
  const Row = ({ children }: PropsWithChildren) => <View style={styles.row}>{children}</View>;

  const chunkedOptions = useMemo(
    () =>
      options.reduce((resultArray: Option<V>[][], item, index) => {
        const chunkIndex = Math.floor(index / columns);

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
      }, []),
    [options, columns],
  );

  return (
    <View>
      {label && <ThemedInputLabel label={label} />}
      <View style={styles.grid}>
        {chunkedOptions.map((chunkedOption, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Row key={i}>
            {chunkedOption.map((option) => (
              <View
                key={String(option.value)}
                style={[
                  styles.buttonContainer,
                  selectedOption === option.value && styles.buttonSelected,
                  buttonContainerStyle,
                ]}
              >
                <Pressable style={styles.pressable} onPress={handleSelectOption(option.value)}>
                  <ThemedText>{option.label}</ThemedText>
                </Pressable>
              </View>
            ))}
          </Row>
        ))}
      </View>

      <InputErrorLabel error={error} />
    </View>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    grid: {
      flex: 4,
      marginHorizontal: "auto",
      alignItems: "center",
      gap: Sizes.small,
    },
    pressable: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    row: {
      flexDirection: "row",
      gap: Sizes.small,
    },
    buttonContainer: {
      backgroundColor: theme.toggleButton.background,
      borderColor: theme.toggleButton.border,
      borderWidth: 1,
      height: 70,
      borderRadius: Sizes.radius.small,
      flex: 1,
    },
    buttonSelected: {
      backgroundColor: theme.toggleButton.selected.background,
      borderColor: theme.toggleButton.selected.border,
    },
  });

export default ThemedToggleButtons;

import React, { useMemo, useState, type PropsWithChildren } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import { Sizes } from "@/constants/Sizes";
import ThemedInputLabel from "./ThemedInputLabel";

type ThemedToggleButtonsProps = {
  options: string[];
  columns: number;
  label?: string;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  selectedOption?: string | null;
  onChangeSelection?: (option: string) => void;
};

function ThemedToggleButtons(props: ThemedToggleButtonsProps) {
  const {
    options,
    columns,
    label,
    onChangeSelection,
    buttonContainerStyle,
    selectedOption: controlledSelectedOption,
  } = props;
  const { styles } = useStyles(createStyles);
  const [internalSelectedOption, setInternalSelectedOption] = useState<string | null>(null);
  const isControlled = controlledSelectedOption !== undefined;
  const selectedOption = useMemo(() => {
    if (isControlled) {
      return controlledSelectedOption;
    }
    return internalSelectedOption;
  }, [internalSelectedOption, controlledSelectedOption, isControlled]);

  const handleSelectOption = (option: string) => () => {
    if (!isControlled) {
      setInternalSelectedOption(option);
    }
    onChangeSelection?.(option);
  };
  const Row = ({ children }: PropsWithChildren) => <View style={styles.row}>{children}</View>;

  const chunkedOptions = useMemo(
    () =>
      options.reduce((resultArray: string[][], item, index) => {
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
                key={option}
                style={[
                  styles.buttonContainer,
                  selectedOption === option && styles.buttonSelected,
                  buttonContainerStyle,
                ]}
              >
                <Pressable style={styles.pressable} onPress={handleSelectOption(option)}>
                  <ThemedText>{option}</ThemedText>
                </Pressable>
              </View>
            ))}
          </Row>
        ))}
      </View>
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

import React, { useMemo, useState, type PropsWithChildren } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { ThemedColors } from "./ThemeProvider";
import useStyles from "@/hooks/useStyles";
import { ThemedText } from "./ThemedText";
import { Sizes } from "@/constants/Sizes";
import ThemedInputLabel from "./ThemedInputLabel";

type ThemedToggleButtonsProps = {
  options: string[];
  columns: number;
  label?: string;
};

const ThemedToggleButtons: React.FC<ThemedToggleButtonsProps> = ({ options, columns, label }) => {
  const { styles } = useStyles(createStyles);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const handleSelectOption = (option: string) => () => {
    setSelectedOption(option);
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
                style={{
                  ...styles.buttonContainer,
                  ...(selectedOption === option ? styles.buttonSelected : {}),
                }}
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
};

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

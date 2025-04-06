import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedInput from "@/components/ThemedInput";
import { StyleSheet, TextInput, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { trackersTable, TrackerType } from "@/db/schema";
import { db } from "@/db";
import { router, useLocalSearchParams } from "expo-router";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { ThemedText } from "@/components/ThemedText";
import { useRef, useState } from "react";
import type { ThemedColors } from "@/components/ThemeProvider";
import useStyles from "@/hooks/useStyles";
import ThemedToggleButtons from "@/components/ThemedToggleButtons";

export default function AddEntryScreen() {
  const { trackerId } = useLocalSearchParams<{ trackerId: string }>();
  const { styles } = useStyles(createStyles);
  const { data: tracker } = useLiveQuery(db.select().from(trackersTable).where(eq(trackersTable.id, +trackerId)));
  const refNumberInput = useRef<TextInput>(null);

  const [numberValue, setNumberValue] = useState<string>("");
  const [scaleValue, setScaleValue] = useState<number | string | null>(null);
  const [yesOrNoValue, setYesOrNoValue] = useState<boolean | null>(null);

  const handleSubmit = async () => {
    router.back();
  };

  const renderEntryInput = () => {
    if (!tracker || !tracker[0]) return null;

    const trackerType = tracker[0].type;

    switch (trackerType) {
      case TrackerType.Number:
        return (
          <TextInput
            ref={refNumberInput}
            style={styles.numberInput}
            onKeyPress={({ nativeEvent }) => console.log("Key pressed:", nativeEvent.key)}
            value={numberValue}
            onChangeText={(text) => setNumberValue(text)}
            keyboardType="numeric"
            autoFocus
            caretHidden
            onBlur={() => {
              refNumberInput?.current?.focus();
            }}
          />
        );

      case TrackerType.Scale:
        return (
          <View>
            <ThemedInput
              label="Or enter value manually"
              value={scaleValue?.toString() ?? ""}
              onChangeText={(text) => setScaleValue(text || null)}
              keyboardType="numeric"
            />
          </View>
        );

      case TrackerType.Boolean:
        return (
          <ThemedToggleButtons
            label=""
            columns={2}
            options={["Yes", "No"]}
            onChangeSelection={(option) => setYesOrNoValue(option === "Yes")}
          />
        );

      case TrackerType.TextList:
        return (
          <View>
            {/* <ThemedInput label="Enter text" value={typeof value === "string" ? value : ""} onChangeText={setValue} /> */}
          </View>
        );

      default:
        return <ThemedText>Unsupported tracker type: {trackerType}</ThemedText>;
    }
  };

  return (
    <ThemedView>
      <ThemedScrollView>{renderEntryInput()}</ThemedScrollView>
      <View style={styles.submitButtonContainer}>
        <ThemedButton fullWidth title="Log entry" onPress={handleSubmit} />
      </View>
    </ThemedView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    submitButtonContainer: {
      paddingHorizontal: Sizes.medium,
      marginBottom: Sizes.medium,
    },
    numberInput: {
      flex: 1,
      color: theme.input.text,
      fontSize: 80,
      height: "100%",
      textAlign: "center",
    },
  });

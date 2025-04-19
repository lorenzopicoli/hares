import ThemedScrollView from "@/components/ThemedScrollView";
import { FormThemedInput } from "@/components/ThemedInput";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { TrackerType } from "@/db/schema";
import { useRouter } from "expo-router";
import { useCreateTracker } from "@/hooks/data/useCreateTracker";
import { FormThemedToggleButtons } from "@/components/ThemedToggleButtons";

interface FormInputs {
  name: string;
  description: string;
  type: TrackerType;
  suffix?: string;
  prefix?: string;
  rangeMax?: number;
  rangeMin?: number;
}

export default function AddTrackerScreen() {
  const router = useRouter();
  const { createTracker } = useCreateTracker();
  const { control, handleSubmit, watch } = useForm<FormInputs>();
  const typeOptions = [
    { value: TrackerType.Number, label: "Number" },
    { value: TrackerType.Scale, label: "Range" },
    { value: TrackerType.TextList, label: "List" },
    { value: TrackerType.Boolean, label: "Yes or No" },
  ];

  const type = watch("type");

  const onSubmit = async (data: FormInputs) => {
    await createTracker(data);
    router.dismiss();
  };

  function handleTypeChange(option: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <ThemedView>
      <ThemedScrollView keyboardShouldPersistTaps="always">
        <FormThemedInput
          form={{
            control,
            name: "name",
            rules: {
              required: {
                message: "Name is required",
                value: true,
              },
            },
          }}
          autoCapitalize="sentences"
          label="Tracker name"
        />
        <FormThemedInput
          form={{ control, name: "description" }}
          autoCapitalize="sentences"
          label="Description/Question (optional)"
        />
        <View style={styles.sideBySide}>
          <FormThemedInput containerStyle={styles.flex1} label="Prefix (optional)" form={{ control, name: "prefix" }} />
          <FormThemedInput containerStyle={styles.flex1} label="Suffix (optional)" form={{ control, name: "suffix" }} />
        </View>
        <FormThemedToggleButtons
          form={{
            control,
            name: "type",
            rules: {
              required: {
                message: "Type is required",
                value: true,
              },
            },
          }}
          label="Value type"
          columns={2}
          options={typeOptions}
          onChangeSelection={handleTypeChange}
        />
        {type === TrackerType.Scale ? (
          <View style={styles.sideBySide}>
            <FormThemedInput
              form={{
                control,
                name: "rangeMin",
                rules: {
                  required: {
                    message: "A minimum value is required for the range type",
                    value: true,
                  },
                },
              }}
              containerStyle={styles.flex1}
              label="Range min"
              keyboardType="numeric"
            />
            <FormThemedInput
              form={{
                control,
                name: "rangeMax",
                rules: {
                  required: {
                    message: "A maximum value is required for the range type",
                    value: true,
                  },
                },
              }}
              containerStyle={styles.flex1}
              label="Range max"
              keyboardType="numeric"
            />
          </View>
        ) : null}
      </ThemedScrollView>

      <View style={styles.submitButtonContainer}>
        <ThemedButton fullWidth title="Create tracker" onPress={handleSubmit(onSubmit)} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  submitButtonContainer: {
    paddingHorizontal: Sizes.medium,
    marginBottom: Sizes.medium,
  },
  sideBySide: {
    flexDirection: "row",
    gap: Sizes.small,
  },
  flex1: {
    flex: 1,
  },
});

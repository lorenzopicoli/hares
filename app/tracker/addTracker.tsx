import ThemedScrollView from "@/components/ThemedScrollView";
import { FormThemedInput } from "@/components/ThemedInput";
import { useForm } from "react-hook-form";
import { Platform, StyleSheet, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedSafeAreaView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { TrackerType } from "@/db/schema";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FormThemedToggleButtons } from "@/components/ThemedToggleButtons";
import { useLazyTracker } from "@/hooks/data/useTracker";
import { useMemo } from "react";
import { useUpsertTracker } from "@/hooks/data/useUpsertTracker";

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
  const { trackerId: trackerIdParam } = useLocalSearchParams<{ trackerId?: string }>();
  const trackerId = useMemo(() => (trackerIdParam ? +(trackerIdParam ?? -1) : undefined), [trackerIdParam]);
  const { fetchTracker } = useLazyTracker();
  const { upsertTracker } = useUpsertTracker();
  const typeOptions = [
    { value: TrackerType.Number, label: "Number" },
    { value: TrackerType.Scale, label: "Range" },
    { value: TrackerType.TextList, label: "List" },
    { value: TrackerType.Boolean, label: "Yes or No" },
  ];
  const { control, handleSubmit, watch } = useForm<FormInputs>({
    defaultValues: async () => {
      const defaultValues: FormInputs = {
        name: "",
        description: "",
        type: TrackerType.Number,
        suffix: "",
        prefix: "",
      };
      if (!trackerId) {
        return defaultValues;
      }
      const { tracker } = await fetchTracker(trackerId);
      if (!tracker) {
        return defaultValues;
      }
      return {
        name: tracker.name,
        description: tracker.description ?? "",
        type: tracker.type,
        suffix: tracker.suffix ?? "",
        prefix: tracker.prefix ?? "",
        rangeMax: tracker.rangeMax ?? undefined,
        rangeMin: tracker.rangeMin ?? undefined,
      };
    },
  });

  const type = watch("type");

  const onSubmit = async (data: FormInputs) => {
    await upsertTracker(data, trackerId);
    router.dismiss();
  };

  return (
    <ThemedSafeAreaView>
      <ThemedScrollView keyboardShouldPersistTaps={Platform.OS === "android" ? "always" : undefined}>
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
        <ThemedButton
          fullWidth
          title={trackerId ? "Edit tracker" : "Create tracker"}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ThemedSafeAreaView>
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

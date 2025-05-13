import { StyleSheet } from "react-native";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import type { ThemedColors } from "@/contexts/ThemeContext";
import useStyles from "@/hooks/useStyles";
import { useDefaultStyles } from "react-native-ui-datepicker";
import { FormThemedToggleButtons } from "@/components/ThemedToggleButtons";
import { useForm, type UseFormWatch } from "react-hook-form";
import { XStack, YStack } from "@/components/Stacks";
import ThemedScrollView from "@/components/ThemedScrollView";
import { Sizes } from "@/constants/Sizes";
import FormDateTimePicker from "@/components/FormDateTimePicker";
import ThemedButton from "@/components/ThemedButton";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { FormThemedInput } from "@/components/ThemedInput";
import FormWeekdaySelector from "@/components/WeekdaySelector";
import { Separator } from "@/components/Separator";
import ThemedInputLabel from "@/components/ThemedInputLabel";
import {
  formatNotificationSchedule,
  NotificationType,
  type NotificationRecurrence,
} from "@/utils/formatNotificationRecurrence";

function ScheduleSummary(props: { watch: UseFormWatch<NotificationRecurrence> }) {
  const [type, time, dayPeriod, daysOfWeek, dayOfMonth] = props.watch([
    "type",
    "time",
    "dayPeriod",
    "daysOfWeek",
    "dayOfMonth",
  ]);
  return (
    <ThemedText style={{ fontSize: 20 }}>
      {formatNotificationSchedule({
        type,
        time,
        dayPeriod,
        daysOfWeek,
        dayOfMonth,
      })}
    </ThemedText>
  );
}

export default function SetupNotificationScreen() {
  const router = useRouter();
  const { styles } = useStyles(createStyles);
  const datePickerDefaultStyles = useDefaultStyles();

  const { control, watch, formState, handleSubmit } = useForm<NotificationRecurrence>({
    defaultValues: {
      type: NotificationType.EveryXDays,
      time: new Date(),
    },
  });

  const type = watch("type");
  const dayPeriod = watch("dayPeriod");

  const onSubmit = async (data: NotificationRecurrence) => {
    router.dismiss();
  };
  return (
    <ThemedSafeAreaView>
      <ThemedScrollView keyboardShouldPersistTaps="never">
        <YStack gap={Sizes.large} alignItems="center" style={styles.container}>
          <ThemedView style={styles.fullWidth}>
            <FormThemedToggleButtons
              label="Recurrence type"
              buttonContainerStyle={{ height: Sizes.buttonHeight }}
              form={{
                control,
                name: "type",
                rules: {
                  required: {
                    message: "A value is required",
                    value: true,
                  },
                },
              }}
              options={[
                { label: "Every X days", value: NotificationType.EveryXDays },
                { label: "Weekly", value: NotificationType.DaysOfWeek },
                { label: "Monthly", value: NotificationType.DaysOfMonth },
              ]}
              columns={3}
            />
          </ThemedView>

          <Separator overrideHorizontalMargin={0} />
          {type === NotificationType.EveryXDays && (
            <YStack style={styles.fullWidth} alignItems="flex-start">
              <ThemedInputLabel label="Repeat every" />
              <XStack alignItems="center" style={styles.fullWidth}>
                <FormThemedInput
                  containerStyle={{ width: 50 }}
                  form={{
                    control,
                    name: "dayPeriod",
                    rules: {
                      required: {
                        message: "A value greater than 1 is required",
                        value: true,
                      },
                      min: {
                        message: "A value greater than 1 is required",
                        value: 1,
                      },
                    },
                  }}
                  keyboardType="numeric"
                />
                <ThemedText>{(dayPeriod ?? 0) > 1 ? "days" : "day"}</ThemedText>
              </XStack>
            </YStack>
          )}

          {type === NotificationType.DaysOfWeek && (
            <YStack alignItems="center" style={styles.fullWidth}>
              <FormWeekdaySelector
                label="Repeats on"
                form={{
                  control,
                  name: "daysOfWeek",
                  rules: {
                    required: {
                      message: "At least one day is required",
                      value: true,
                    },
                  },
                }}
              />
            </YStack>
          )}

          {type === NotificationType.DaysOfMonth && (
            <YStack style={styles.fullWidth} alignItems="flex-start">
              <ThemedInputLabel label="Repeats on" />
              <XStack alignItems="center" style={styles.fullWidth}>
                <FormThemedInput
                  containerStyle={{ width: 50 }}
                  form={{
                    control,
                    name: "dayOfMonth",
                    rules: {
                      required: {
                        message: "A value between 1 and 31 is required",
                        value: true,
                      },
                      max: {
                        message: "A value between 1 and 31 is required",
                        value: 31,
                      },
                      min: {
                        message: "A value between 1 and 31 is required",
                        value: 1,
                      },
                    },
                  }}
                  keyboardType="numeric"
                />
              </XStack>
            </YStack>
          )}

          <Separator overrideHorizontalMargin={0} />
          <YStack gap={0} alignItems="center" style={styles.fullWidth}>
            <ThemedView style={styles.fullWidth}>
              <ThemedInputLabel label="Time of the notification" />
              <FormDateTimePicker
                form={{
                  control,
                  name: "time",
                  rules: {
                    required: true,
                  },
                }}
                mode="single"
                initialView="time"
                timePicker
                hideHeader
                disableMonthPicker
                disableYearPicker
                style={{ marginTop: -20 }}
                styles={{
                  ...datePickerDefaultStyles,
                }}
              />
            </ThemedView>
          </YStack>
        </YStack>
      </ThemedScrollView>
      <YStack style={styles.submitButtonContainer}>
        {formState.isValid ? (
          <>
            <Separator overrideHorizontalMargin={0} />
            <ScheduleSummary watch={watch} />
          </>
        ) : null}
        <ThemedButton
          fullWidth
          title="Save notification"
          disabled={!formState.isValid}
          onPress={handleSubmit(onSubmit)}
        />
      </YStack>
    </ThemedSafeAreaView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: Sizes.medium,
    },
    fullWidth: {
      width: "100%",
    },
    textCenter: {
      textAlign: "center",
    },
    summaryLabel: {
      fontSize: 20,
    },
    submitButtonContainer: {
      paddingHorizontal: Sizes.medium,
      marginBottom: Sizes.medium,
    },
  });

import { StyleSheet } from "react-native";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import { useColors, type ThemedColors } from "@/contexts/ThemeContext";
import useStyles from "@/hooks/useStyles";
import { FormThemedToggleButtons } from "@/components/ThemedToggleButtons";
import { Controller, useForm, type FormState, type UseFormWatch } from "react-hook-form";
import { YStack } from "@/components/Stacks";
import { Sizes } from "@/constants/Sizes";
import ThemedButton from "@/components/ThemedButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { FormThemedInput } from "@/components/ThemedInput";
import FormWeekdaySelector from "@/components/WeekdaySelector";
import {
  formatNotificationSchedule,
  NotificationType,
  type NotificationRecurrence,
} from "@/utils/formatNotificationRecurrence";
import type { ISection } from "@/components/SectionList";
import SectionList from "@/components/SectionList";
import { useCallback, useRef } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { TimeSelectionBottomSheet } from "@/components/BottomSheets/TimeSelectionBottomSheet";
import ActionableListItem from "@/components/ActionableListItem";
import { format } from "date-fns";
import TextListItem from "@/components/TextListItem";
import { Separator } from "@/components/Separator";

function ScheduleSummary(props: {
  formState: FormState<NotificationRecurrence>;
  watch: UseFormWatch<NotificationRecurrence>;
}) {
  const [type, time, daysOfWeek, dayOfMonth] = props.watch(["type", "time", "daysOfWeek", "dayOfMonth"]);
  return (
    <ThemedText style={{ textOverflow: "wrap" }}>
      {props.formState.isValid
        ? formatNotificationSchedule({
            type,
            time,
            daysOfWeek,
            dayOfMonth,
          })
        : "Missing information"}
    </ThemedText>
  );
}

export default function SetupNotificationScreen() {
  const router = useRouter();
  const { colors } = useColors();
  const { styles } = useStyles(createStyles);
  const timeSelectionBottomSheet = useRef<BottomSheetModal>(null);

  const { notificationId, dismissTo } = useLocalSearchParams<{ notificationId?: string; dismissTo: string }>();

  const { control, watch, formState, handleSubmit } = useForm<NotificationRecurrence>({
    defaultValues: {
      type: NotificationType.EveryXDays,
      time: new Date(),
    },
  });

  const type = watch("type");

  const onSubmit = async (data: NotificationRecurrence) => {
    router.dismissTo({
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      pathname: dismissTo as any,
      params: {
        notificationSettings: JSON.stringify(data),
      },
    });
  };
  const showTimeSelectionBottomSheet = useCallback(() => {
    timeSelectionBottomSheet.current?.present();
  }, []);

  const sections: ISection[] = [
    {
      //   title: <ThemedText type="title">Recurrence</ThemedText>,
      data: [
        {
          key: "type",
          render: (
            <ThemedView style={styles.itemContainer}>
              <FormThemedToggleButtons
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
                  { label: "Never", value: null },
                  { label: "Every day", value: NotificationType.EveryXDays },
                  { label: "Weekly", value: NotificationType.DaysOfWeek },
                  { label: "Monthly", value: NotificationType.DaysOfMonth },
                ]}
                columns={2}
              />
            </ThemedView>
          ),
        },
        ...(type === NotificationType.DaysOfWeek
          ? [
              {
                key: "daysOfWeek",
                render: (
                  <ThemedView style={styles.itemContainer}>
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
                  </ThemedView>
                ),
              },
            ]
          : []),
        ...(type === NotificationType.DaysOfMonth
          ? [
              {
                key: "dayOfMonth",
                render: (
                  <ThemedView style={styles.itemContainer}>
                    <FormThemedInput
                      label="Day of the month"
                      keyboardType="numeric"
                      form={{
                        control,
                        name: "dayOfMonth",
                        rules: { required: { message: "A value is required", value: true } },
                      }}
                    />
                  </ThemedView>
                ),
              },
            ]
          : []),
        {
          key: "time",
          render: (
            <>
              <Separator containerBackgroundColor={colors.secondaryBackground} />
              <ActionableListItem
                title="Notification time"
                subtitle={format(watch("time"), "HH:mm")}
                onPress={showTimeSelectionBottomSheet}
                height={Sizes.list.large}
              />
            </>
          ),
        },
      ],
    },
    {
      title: <ThemedText type="title">Summary</ThemedText>,
      data: [
        {
          key: "summary",
          render: <TextListItem dynamicHeight title={<ScheduleSummary formState={formState} watch={watch} />} />,
        },
      ],
    },
  ];
  return (
    <ThemedSafeAreaView>
      <SectionList
        ItemSeparatorComponent={() => null}
        contentContainerStyle={styles.listContentContainer}
        sections={sections}
      />
      <YStack style={styles.submitButtonContainer}>
        <ThemedButton
          fullWidth
          title="Save notification"
          disabled={!formState.isValid}
          onPress={handleSubmit(onSubmit)}
        />
      </YStack>
      <Controller
        control={control}
        name="time"
        render={({ field: { onChange, value } }) => (
          <TimeSelectionBottomSheet onChange={(d) => onChange(d.date)} date={value} ref={timeSelectionBottomSheet} />
        )}
      />
    </ThemedSafeAreaView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: Sizes.medium,
    },
    submitButtonContainer: {
      paddingHorizontal: Sizes.medium,
      marginBottom: Sizes.medium,
    },
    itemContainer: {
      padding: Sizes.medium,
      backgroundColor: theme.secondaryBackground,
    },
    listContentContainer: {
      paddingHorizontal: Sizes.medium,
    },
  });

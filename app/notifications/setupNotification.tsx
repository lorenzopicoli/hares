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
import type { ISection } from "@/components/SectionList";
import SectionList from "@/components/SectionList";
import { useCallback, useMemo, useRef } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { TimeSelectionBottomSheet } from "@/components/BottomSheets/TimeSelectionBottomSheet";
import ActionableListItem from "@/components/ActionableListItem";
import { format, parse } from "date-fns";
import TextListItem from "@/components/TextListItem";
import { Separator } from "@/components/Separator";
import type { NewNotification } from "@/db/schema";
import { getDateTime } from "@/utils/getDateTime";
import { formatNotificationsSchedule } from "@/utils/formatNotificationRecurrence";
import { useUpsertNotification } from "@/hooks/data/useUpsertNotification";
import { useClearExportNotifications } from "@/hooks/data/useClearNotifications";

export enum NotificationType {
  EveryDay = "EveryDay",
  DaysOfWeek = "DaysOfWeek",
  DaysOfMonth = "DaysOfMonth",
}

export interface NotificationFormInputs {
  type?: NotificationType | null;
  time: Date;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

export type SetupNotificationResult = Omit<NewNotification, "trackerId" | "isExport" | "deviceNotificationId">;

function ScheduleSummary(props: {
  formState: FormState<NotificationFormInputs>;
  watch: UseFormWatch<NotificationFormInputs>;
}) {
  const [type, time, daysOfWeek, dayOfMonth] = props.watch(["type", "time", "daysOfWeek", "dayOfMonth"]);

  const dateTime = useMemo(() => {
    return getDateTime(time);
  }, [time]);
  return (
    <ThemedText style={{ textOverflow: "wrap" }}>
      {type === null
        ? "You won't be notified"
        : props.formState.isValid
          ? formatNotificationsSchedule({
              hour: dateTime.hour,
              minute: dateTime.min,
              daysOfWeek: daysOfWeek ?? null,
              daysOfMonth: dayOfMonth,
            })
          : "Missing information"}
    </ThemedText>
  );
}

export default function SetupNotificationScreen() {
  const router = useRouter();
  const { colors } = useColors();
  const { styles } = useStyles(createStyles);
  const { upsertExportNotification } = useUpsertNotification();
  const { clearExportNotifications } = useClearExportNotifications();
  const timeSelectionBottomSheet = useRef<BottomSheetModal>(null);

  const {
    dismissTo,
    passthroughParams,
    saveExport,
    initialFormValues: initialFormValuesParams,
  } = useLocalSearchParams<{
    dismissTo: string;
    passthroughParams?: string;
    initialFormValues?: string;
    saveExport?: string;
  }>();

  const initialFormValues: NotificationFormInputs = useMemo(() => {
    if (!initialFormValuesParams) {
      return { type: null, time: new Date() };
    }
    const parsed = JSON.parse(initialFormValuesParams) as SetupNotificationResult;

    const timeDate = parse(`${parsed.hour}:${parsed.minute}`, "HH:mm", new Date());
    return {
      type: parsed.daysOfWeek
        ? NotificationType.DaysOfWeek
        : parsed.daysOfMonth
          ? NotificationType.DaysOfMonth
          : NotificationType.EveryDay,
      time: timeDate,
      daysOfWeek: parsed.daysOfWeek ?? undefined,
      dayOfMonth: parsed.daysOfMonth ?? undefined,
    };
  }, [initialFormValuesParams]);

  const { control, watch, formState, handleSubmit } = useForm<NotificationFormInputs>({
    defaultValues: initialFormValues ? initialFormValues : undefined,
  });

  const type = watch("type");

  const onSubmit = async (data: NotificationFormInputs) => {
    const timeInfo = getDateTime(data.time);
    const notification: SetupNotificationResult | null =
      data.type === null
        ? null
        : {
            daysOfWeek: data.type === NotificationType.DaysOfWeek ? (data.daysOfWeek ?? null) : null,
            daysOfMonth: data.type === NotificationType.DaysOfMonth ? data.dayOfMonth : null,
            minute: timeInfo.min,
            hour: timeInfo.hour,
          };

    if (saveExport) {
      if (notification) {
        await upsertExportNotification(notification);
      } else {
        await clearExportNotifications();
      }
    }

    router.dismissTo({
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      pathname: dismissTo as any,
      params: {
        notificationSettings: notification ? JSON.stringify(notification) : "never",
        ...(passthroughParams ? JSON.parse(passthroughParams) : {}),
      },
    });
  };
  const showTimeSelectionBottomSheet = useCallback(() => {
    timeSelectionBottomSheet.current?.present();
  }, []);

  const sections: ISection[] = [
    {
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
                }}
                options={[
                  { label: "Never", value: null },
                  { label: "Every day", value: NotificationType.EveryDay },
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
        ...(type !== null
          ? [
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
            ]
          : []),
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

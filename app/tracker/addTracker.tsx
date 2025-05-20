import { FormThemedInput } from "@/components/ThemedInput";
import { useForm } from "react-hook-form";
import { Platform, StyleSheet, View } from "react-native";
import ThemedButton from "@/components/ThemedButton";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { TrackerType } from "@/db/schema";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FormThemedToggleButtons } from "@/components/ThemedToggleButtons";
import { useLazyTracker } from "@/hooks/data/useTracker";
import { useCallback, useMemo } from "react";
import { useUpsertTracker } from "@/hooks/data/useUpsertTracker";
import ActionableListItem from "@/components/ActionableListItem";
import SectionList, { type ISection } from "@/components/SectionList";
import useStyles from "@/hooks/useStyles";
import { XStack } from "@/components/Stacks";
import { ThemedText } from "@/components/ThemedText";
import { useColors, type ThemedColors } from "@/contexts/ThemeContext";
import TextListItem from "@/components/TextListItem";
import { Separator } from "@/components/Separator";
import { useUpsertNotification } from "@/hooks/data/useUpsertNotification";
import { useDatabaseNotifications } from "@/hooks/data/useDatabaseNotifications";
import type { SetupNotificationResult } from "../notifications/setupNotification";
import { formatNotificationsSchedule } from "@/utils/formatNotificationRecurrence";
import { useClearTrackerNotifications } from "@/hooks/data/useClearNotifications";

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
  const { styles } = useStyles(createStyles);
  const router = useRouter();
  const { colors } = useColors();
  const { trackerId: trackerIdParam, notificationSettings: notificationSettingsParam } = useLocalSearchParams<{
    trackerId?: string;
    notificationSettings?: string;
  }>();
  const trackerId = useMemo(() => (trackerIdParam ? +(trackerIdParam ?? -1) : undefined), [trackerIdParam]);
  const { fetchTracker } = useLazyTracker();
  const { upsertTracker } = useUpsertTracker();
  const { upsertTrackerNotification } = useUpsertNotification();
  const { clearTrackerNotifications } = useClearTrackerNotifications();
  const { notifications } = useDatabaseNotifications({ isExport: false, trackerId: trackerId ?? -1 });
  const notificationSettings = useMemo(() => {
    if (notificationSettingsParam === "never") {
      return null;
    }

    return notificationSettingsParam
      ? (JSON.parse(notificationSettingsParam) as SetupNotificationResult)
      : (notifications?.[0] ?? null);
  }, [notificationSettingsParam, notifications]);

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
    const newTrackerId = await upsertTracker(data, trackerId);
    const { tracker } = await fetchTracker(newTrackerId);
    if (tracker) {
      if (notificationSettings) {
        await upsertTrackerNotification(notificationSettings, tracker);
      } else {
        await clearTrackerNotifications(tracker);
      }
    }
    router.dismiss();
  };

  const handleSetupNotificationPress = useCallback(() => {
    router.navigate({
      pathname: "/notifications/setupNotification",
      params: {
        dismissTo: "/tracker/addTracker",
        passthroughParams: JSON.stringify({
          trackerId,
        }),
        initialFormValues: notificationSettings ? JSON.stringify(notificationSettings) : undefined,
      },
    });
  }, [router, trackerId, notificationSettings]);

  const sections: ISection[] = [
    {
      data: [
        {
          key: "name",
          render: (
            <ThemedView style={[styles.detailsItemContainer, { marginTop: Sizes.small }]}>
              <FormThemedInput form={{ control, name: "name" }} label="Tracker name" />
            </ThemedView>
          ),
        },
        {
          key: "description",
          render: (
            <ThemedView style={styles.detailsItemContainer}>
              <FormThemedInput form={{ control, name: "description" }} label="Description/Question (optional)" />
            </ThemedView>
          ),
        },
        {
          key: "prefix-suffix",
          render: (
            <XStack style={[styles.valueTypeItemContainer, { marginBottom: Sizes.small }]} gap={Sizes.small}>
              <View style={styles.flex1}>
                <FormThemedInput form={{ control, name: "prefix" }} label="Prefix (optional)" />
              </View>
              <View style={styles.flex1}>
                <FormThemedInput form={{ control, name: "suffix" }} label="Suffix (optional)" />
              </View>
            </XStack>
          ),
        },
      ],
    },
    {
      title: <ThemedText type="title">Entry type</ThemedText>,
      data: [
        {
          key: "type",
          render: (
            <ThemedView style={styles.valueTypeItemContainer}>
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
                columns={2}
                options={typeOptions}
              />
            </ThemedView>
          ),
        },
        ...(type === TrackerType.Scale
          ? [
              {
                key: "range",
                render: (
                  <XStack style={[styles.valueTypeItemContainer, { marginBottom: Sizes.small }]} gap={Sizes.small}>
                    <View style={styles.flex1}>
                      <FormThemedInput form={{ control, name: "rangeMin" }} label="Range min" />
                    </View>
                    <View style={styles.flex1}>
                      <FormThemedInput form={{ control, name: "rangeMax" }} label="Range max" />
                    </View>
                  </XStack>
                ),
              },
            ]
          : []),
      ],
    },

    {
      title: <ThemedText type="title">Notifications</ThemedText>,
      data: [
        {
          key: "setup-notifications",
          render: (
            <View>
              <ActionableListItem
                title={notificationSettings ? "Change notifications settings" : "Set up notifications"}
                onPress={handleSetupNotificationPress}
              />
              <Separator containerBackgroundColor={colors.secondaryBackground} />
            </View>
          ),
        },
        {
          key: "notifications-enabled",
          render: (
            <TextListItem
              dynamicHeight
              title={
                notificationSettings ? formatNotificationsSchedule(notificationSettings) : "No notifications enabled"
              }
            />
          ),
        },
      ],
    },
  ];
  return (
    <ThemedSafeAreaView>
      <SectionList
        keyboardShouldPersistTaps={Platform.OS === "android" ? "always" : undefined}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => null}
        sections={sections}
      />
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

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    submitButtonContainer: {
      paddingHorizontal: Sizes.medium,
      marginBottom: Sizes.medium,
    },
    flex1: {
      flex: 1,
    },
    detailsItemContainer: {
      paddingHorizontal: Sizes.medium,
      paddingVertical: Sizes.small,
      backgroundColor: theme.secondaryBackground,
    },
    valueTypeItemContainer: {
      paddingHorizontal: Sizes.medium,
      paddingVertical: Sizes.medium,
      backgroundColor: theme.secondaryBackground,
    },
    listContentContainer: {
      paddingBottom: Sizes.large,
      paddingHorizontal: Sizes.medium,
    },
  });

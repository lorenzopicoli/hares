import { Separator } from "@/components/Separator";
import { YStack } from "@/components/Stacks";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Sizes } from "@/constants/Sizes";
import { useColors, type ThemedColors } from "@/contexts/ThemeContext";
import type { Notification, Tracker } from "@/db/schema";
import { useDatabaseNotifications } from "@/hooks/data/useDatabaseNotifications";
import useStyles from "@/hooks/useStyles";
import { databaseNotificationToRecurrence, formatNotificationSchedule } from "@/utils/formatNotificationRecurrence";
import { format } from "date-fns";
import {
  getAllScheduledNotificationsAsync,
  getNextTriggerDateAsync,
  type NotificationRequest,
  type SchedulableNotificationTriggerInput,
} from "expo-notifications";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

type NotificationWithNextTriggerDate = Notification & { tracker: Tracker } & {
  nextTriggerDate?: Date;
};

function NotificationRow(props: { notification: NotificationWithNextTriggerDate }) {
  const { notification } = props;
  const { styles } = useStyles(createStyles);

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={() => {}}>
      <YStack>
        <ThemedText type="title">{notification.tracker.name}</ThemedText>
        <ThemedText>{formatNotificationSchedule(databaseNotificationToRecurrence(notification), true)}</ThemedText>
        {notification.nextTriggerDate ? (
          <ThemedText type="subtitle">
            Next reminder: {format(notification.nextTriggerDate, "MMM d, yyyy hh:mm a")}
          </ThemedText>
        ) : null}
      </YStack>
    </TouchableOpacity>
  );
}

export default function ManageNotificationsScreen() {
  const { styles } = useStyles(createStyles);
  const { notifications } = useDatabaseNotifications({ isExport: false });
  const { colors } = useColors();
  const [deviceNotifications, setDeviceNotifications] = useState<(NotificationRequest & { nextTriggerDate: Date })[]>(
    [],
  );

  const updateDeviceNotifications = useCallback(async () => {
    const notifications = await getAllScheduledNotificationsAsync();
    const newDeviceNotifications: (NotificationRequest & { nextTriggerDate: Date })[] = [];
    for (const notification of notifications) {
      if (!notification.trigger) {
        continue;
      }
      const nextTriggerDate = await getNextTriggerDateAsync(
        notification.trigger as SchedulableNotificationTriggerInput,
      );
      if (nextTriggerDate) {
        newDeviceNotifications.push({
          ...notification,
          nextTriggerDate: new Date(nextTriggerDate),
        });
      }
    }

    console.log(JSON.stringify(newDeviceNotifications, null, 2));
    setDeviceNotifications(newDeviceNotifications);
  }, []);

  const notificationsWithNextTriggerDate = useMemo(() => {
    return notifications.map((notification) => ({
      ...notification,
      nextTriggerDate: deviceNotifications.find(
        (deviceNotification) => deviceNotification.identifier === notification.deviceNotificationId,
      )?.nextTriggerDate,
    }));
  }, [notifications, deviceNotifications]);

  useEffect(() => {
    updateDeviceNotifications();
  }, [updateDeviceNotifications]);

  console.log(JSON.stringify(deviceNotifications, null, 2));
  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={notificationsWithNextTriggerDate}
        renderItem={({ item }) => <NotificationRow notification={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => (
          <Separator overrideHorizontalMargin={0} containerBackgroundColor={colors.background} />
        )}
      />
    </ThemedView>
  );
}

const createStyles = (theme: ThemedColors) =>
  StyleSheet.create({
    container: {},
    contentContainer: {
      padding: Sizes.medium,
    },
    itemContainer: {
      padding: Sizes.small,
      paddingVertical: Sizes.medium,
    },
  });

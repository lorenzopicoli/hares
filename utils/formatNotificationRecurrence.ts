import type { SetupNotificationResult } from "@/app/notifications/setupNotification";
import { format, parse } from "date-fns";

// export function databaseNotificationToRecurrence(notification: Notification): NotificationRecurrence {
//   const type = notification.daysOfWeek
//     ? NotificationType.DaysOfWeek
//     : notification.daysOfMonth
//       ? NotificationType.DaysOfMonth
//       : NotificationType.EveryDay;

//   return {
//     type,
//     time: parse(`${notification.hour}:${notification.minute}`, "HH:mm", new Date()),
//     daysOfWeek: notification.daysOfWeek ?? undefined,
//     dayOfMonth: notification.daysOfMonth ?? undefined,
//   };
// }

// export function formatSetupNotificationsInputSchedule(inputs: NotificationFormInputs) {}

// export function formatDatabaseNotificationSchedule(notification: Notification) {}

export function formatNotificationsSchedule(notification: SetupNotificationResult, short?: boolean) {
  const timeDate = parse(`${notification.hour}:${notification.minute}`, "HH:mm", new Date());
  const timeString = format(timeDate, "h:mm a");
  const prefix = short ? null : "You'll be notified";

  if (notification.daysOfWeek && notification.daysOfWeek.length > 0) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const selectedDays = notification.daysOfWeek.sort().map((day) => daysOfWeek[day - 1]);

    if (selectedDays.length === 0) {
      return "Invalid days of week selected";
    }

    if (selectedDays.length === 7) {
      return prefix ? `${prefix} daily at ${timeString}` : `Daily at ${timeString}`;
    }

    if (selectedDays.length === 1) {
      return prefix
        ? `${prefix} every ${selectedDays[0]} at ${timeString}`
        : `Every ${selectedDays[0]} at ${timeString}`;
    }

    const daysText = `${selectedDays.slice(0, -1).join(", ")} and ${selectedDays[selectedDays.length - 1]}`;

    return prefix ? `${prefix} on ${daysText} at ${timeString}` : `On ${daysText} at ${timeString}`;
  }

  if (notification.daysOfMonth) {
    const dayWithSuffix = addOrdinalSuffix(notification.daysOfMonth);

    return prefix
      ? `${prefix} on the ${dayWithSuffix} day of each month at ${timeString}`
      : `On the ${dayWithSuffix} day of each month at ${timeString}`;
  }

  return prefix ? `${prefix} daily at ${timeString}` : `Daily at ${timeString}`;
}

function addOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

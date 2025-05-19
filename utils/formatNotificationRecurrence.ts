import { NotificationType, type Notification, type NotificationRecurrence } from "@/db/schema";
import { format, parse } from "date-fns";

export function databaseNotificationToRecurrence(notification: Notification): NotificationRecurrence {
  const type = notification.daysOfWeek
    ? NotificationType.DaysOfWeek
    : notification.daysOfMonth
      ? NotificationType.DaysOfMonth
      : NotificationType.EveryDay;

  return {
    type,
    time: parse(`${notification.hour}:${notification.minute}`, "HH:mm", new Date()),
    daysOfWeek: notification.daysOfWeek ?? undefined,
    dayOfMonth: notification.daysOfMonth ?? undefined,
  };
}

export function formatNotificationSchedule(inputs: NotificationRecurrence, short?: boolean): string {
  const timeString = format(inputs.time, "h:mm a");
  const prefix = short ? null : "You'll be notified";

  switch (inputs.type) {
    case NotificationType.EveryDay:
      return prefix ? `${prefix} daily at ${timeString}` : `Daily at ${timeString}`;

    case NotificationType.DaysOfWeek: {
      if (inputs.daysOfWeek === undefined) {
        return "";
      }

      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      const selectedDays = inputs.daysOfWeek.sort().map((day) => daysOfWeek[day - 1]);

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

    case NotificationType.DaysOfMonth: {
      if (!inputs.dayOfMonth || inputs.dayOfMonth < 1 || inputs.dayOfMonth > 31) {
        return "Invalid day of month selected";
      }

      const dayWithSuffix = addOrdinalSuffix(inputs.dayOfMonth);

      return prefix
        ? `${prefix} on the ${dayWithSuffix} day of each month at ${timeString}`
        : `On the ${dayWithSuffix} day of each month at ${timeString}`;
    }

    default:
      return "";
  }
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

import { format } from "date-fns";

export enum NotificationType {
  EveryXDays = "EveryXDays",
  DaysOfWeek = "DaysOfWeek",
  DaysOfMonth = "DaysOfMonth",
}

export interface NotificationRecurrence {
  type: NotificationType;
  time: Date;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

export function formatNotificationSchedule(inputs: NotificationRecurrence): string {
  const timeString = format(inputs.time, "h:mm a");

  switch (inputs.type) {
    case NotificationType.EveryXDays:
      return `You'll be notified daily at ${timeString}`;

    case NotificationType.DaysOfWeek: {
      if (inputs.daysOfWeek === undefined) {
        return "";
      }

      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      const selectedDays = inputs.daysOfWeek
        .map((isOn, i) => (isOn ? i : -1))
        .filter((day, i) => day >= 0 && day <= 6)
        .map((day) => daysOfWeek[day]);

      if (selectedDays.length === 0) {
        return "Invalid days of week selected";
      }

      if (selectedDays.length === 7) {
        return `You'll be notified daily at ${timeString}`;
      }

      if (selectedDays.length === 1) {
        return `You'll be notified every ${selectedDays[0]} at ${timeString}`;
      }

      const daysText =
        selectedDays.length === 1
          ? selectedDays[0]
          : `${selectedDays.slice(0, -1).join(", ")}, and ${selectedDays[selectedDays.length - 1]}`;

      return `You'll be notified on ${daysText} at ${timeString}`;
    }

    case NotificationType.DaysOfMonth: {
      if (!inputs.dayOfMonth || inputs.dayOfMonth < 1 || inputs.dayOfMonth > 31) {
        return "Invalid day of month selected";
      }

      const dayWithSuffix = addOrdinalSuffix(inputs.dayOfMonth);

      return `You'll be notified on the ${dayWithSuffix} day of each month at ${timeString}`;
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

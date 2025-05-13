import { format } from "date-fns";

export enum NotificationType {
  EveryXDays = "EveryXDays",
  DaysOfWeek = "DaysOfWeek",
  DaysOfMonth = "DaysOfMonth",
}

export interface NotificationRecurrence {
  type: NotificationType;
  time: Date;
  dayPeriod?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

export function formatNotificationSchedule(inputs: NotificationRecurrence): string {
  const timeString = format(inputs.time, "h:mm a");

  switch (inputs.type) {
    case NotificationType.EveryXDays:
      if (!inputs.dayPeriod || inputs.dayPeriod < 1) {
        return "";
      }

      if (inputs.dayPeriod === 1) {
        return `You'll be notified daily at ${timeString}`;
      }
      return `You'll be notified every ${inputs.dayPeriod} days at ${timeString}`;

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

      // Add appropriate suffix to day number (1st, 2nd, 3rd, etc.)
      const dayWithSuffix = addOrdinalSuffix(inputs.dayOfMonth);

      return `You'll be notified on the ${dayWithSuffix} day of each month at ${timeString}`;
    }

    default:
      return "";
  }
}

/**
 * Add ordinal suffix to a number (1st, 2nd, 3rd, etc.)
 * @param day The day number
 * @returns The day with appropriate suffix
 */
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

// Examples of usage:
/*
const examples = [
  { type: NotificationType.DAILY, time: new Date('2023-01-01T08:30:00') },
  { type: NotificationType.PERIODIC, time: new Date('2023-01-01T12:00:00'), dayPeriod: 3 },
  { type: NotificationType.WEEKLY, time: new Date('2023-01-01T18:15:00'), dayOfWeek: 1 },
  { type: NotificationType.MONTHLY, time: new Date('2023-01-01T09:00:00'), dayOfMonth: 15 },
];

examples.forEach(example => {
  console.log(formatNotificationSchedule(example));
});
*/

// Output:
// You'll be notified daily at 8:30 AM
// You'll be notified every 3 days at 12:00 PM
// You'll be notified every Monday at 6:15 PM
// You'll be notified on the 15th day of each month at 9:00 AM

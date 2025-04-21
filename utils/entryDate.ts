import { type EntryDateInformation, PeriodOfDay, type TrackerEntry } from "@/db/schema";
import { format } from "date-fns";

const dateTimeFormat = "dd/MM/yyyy - H:mm";
const dateFormat = "dd/MM/yyyy";

export function formatPeriodOfDay(periodOfDay?: PeriodOfDay | string) {
  if (!periodOfDay) {
    return "";
  }
  switch (periodOfDay) {
    case PeriodOfDay.Afternoon:
      return "Afternoon";
    case PeriodOfDay.Morning:
      return "Morning";
    case PeriodOfDay.Evening:
      return "Evening";

    default:
      return "Unknonw";
  }
}

export function formatEntryDate(entry: TrackerEntry) {
  if (entry.date && entry.periodOfDay) {
    return `${format(entry.date, dateFormat)} ${formatPeriodOfDay(entry.periodOfDay)}`;
  }

  if (entry.date) {
    return format(entry.date, dateTimeFormat);
  }

  if (entry.periodOfDay) {
    return formatPeriodOfDay(entry.periodOfDay);
  }

  return "Unknown";
}

export function formatEntryDateInformation(date: EntryDateInformation) {
  if (date.now) {
    return "Now";
  }

  if (date.date && date.periodOfDay) {
    return `${format(date.date, dateFormat)} ${formatPeriodOfDay(date.periodOfDay)}`;
  }

  if (date.date) {
    return format(date.date, dateTimeFormat);
  }

  if (date.periodOfDay) {
    return formatPeriodOfDay(date.periodOfDay);
  }

  return "Unknown";
}

export function formatDate(date?: Date) {
  if (!date) {
    return "";
  }
  return format(date, dateTimeFormat);
}

import { type EntryDateInformation, PeriodOfDay, type TrackerEntry } from "@/db/schema";
import { format } from "date-fns";

const dateFormat = "dd/MM/yyyy - H:mm";

export function formatPeriodOfDay(periodOfDay: PeriodOfDay | string) {
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
  if (entry.date) {
    return format(entry.date, dateFormat);
  }

  if (entry.periodOfDay) {
    return formatPeriodOfDay(entry.periodOfDay);
  }

  return "Unknown";
}

export function formatEntryDateInformation(date: EntryDateInformation) {
  if ("date" in date) {
    return format(date.date, dateFormat);
  }

  if ("periodOfDay" in date) {
    return formatPeriodOfDay(date.periodOfDay);
  }

  return "Unknown";
}

import type { EntryDateInformation, TrackerEntry } from "@/db/schema";
import { format } from "date-fns";

const dateFormat = "dd/MM/yyyy - H:mm";

export function formatEntryDate(entry: TrackerEntry) {
  if (entry.date) {
    return format(entry.date, dateFormat);
  }

  if (entry.periodOfDay) {
    return entry.periodOfDay;
  }

  return "Unknown";
}

export function formatEntryDateInformation(date: EntryDateInformation) {
  if ("date" in date) {
    return format(date.date, dateFormat);
  }

  if ("periodOfDay" in date) {
    return date.periodOfDay;
  }

  return "Unknown";
}

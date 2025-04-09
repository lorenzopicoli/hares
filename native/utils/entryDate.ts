import type { EntryDateInformation } from "@/db/schema";
import { format } from "date-fns";

export function formatEntryDate(date: EntryDateInformation) {
  if ("date" in date) {
    return format(date.date, "MMMM do, yyyy H:mma");
  }

  if ("periodOfDay" in date) {
    return date.periodOfDay;
  }

  return "Unknown";
}

import { format } from "date-fns";

export const getDateTime = (date?: Date) => {
  if (!date) {
    return;
  }
  return {
    hour: +format(date, "HH"),
    min: +format(date, "mm"),
    formatted: format(date, "HH:mm"),
  };
};

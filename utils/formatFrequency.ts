export function formatFrequency(frequencyInHours?: number): string {
  if (!frequencyInHours) {
    return "Never";
  }

  if (frequencyInHours < 0) {
    return `Every ${Math.abs(frequencyInHours)} hours`;
  }

  if (frequencyInHours < 1) {
    const minutes = Math.round(frequencyInHours * 60);
    return `Every ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }

  if (frequencyInHours === 1) {
    return "Every hour";
  }

  if (frequencyInHours < 24) {
    return `Every ${frequencyInHours} hours`;
  }

  const days = frequencyInHours / 24;
  if (days < 7) {
    const wholeDays = Math.round(days);
    return `Every ${wholeDays} ${wholeDays === 1 ? "day" : "days"}`;
  }

  const weeks = days / 7;
  if (weeks < 4) {
    const wholeWeeks = Math.round(weeks);
    return `Every ${wholeWeeks} ${wholeWeeks === 1 ? "week" : "weeks"}`;
  }

  const months = days / 30.44;
  if (months < 12) {
    const wholeMonths = Math.round(months);
    return `Every ${wholeMonths} ${wholeMonths === 1 ? "month" : "months"}`;
  }

  const years = days / 365.25;
  const wholeYears = Math.round(years);
  return `Every ${wholeYears} ${wholeYears === 1 ? "year" : "years"}`;
}

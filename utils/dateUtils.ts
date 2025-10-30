
export const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const dayCount = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: dayCount }, (_, i) => new Date(Date.UTC(year, month, i + 1)));
};

export const getMonthName = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getUTCFullYear() === date2.getUTCFullYear() &&
           date1.getUTCMonth() === date2.getUTCMonth() &&
           date1.getUTCDate() === date2.getUTCDate();
};

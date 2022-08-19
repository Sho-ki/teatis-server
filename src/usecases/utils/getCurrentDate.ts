export const formatDateYearMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = ('00' + (date.getMonth()+1)).slice(-2);
  return `${year}-${month}`;
};

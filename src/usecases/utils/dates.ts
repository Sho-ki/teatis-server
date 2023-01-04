import { DateTime } from 'luxon';

export const nextMonth = (): string => {
  const nextMonth = DateTime.now().plus({ month: 1 }).toFormat('yyyy-MM');
  return nextMonth;
};

export const currentMonth = (): string => {
  const nextMonth = DateTime.now().toFormat('yyyy-MM');
  return nextMonth;
};

export const previousMonth = (): string => {
  const nextMonth = DateTime.now().minus({ month: 1 }).toFormat('yyyy-MM');
  return nextMonth;
};

export const pstTime = ():number => {
  const currentTime = DateTime.local();
  const pstTime = currentTime.setZone('America/Los_Angeles');
  return pstTime.hour;
};

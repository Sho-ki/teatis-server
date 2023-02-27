import { DateTime, Duration } from 'luxon';

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

export const yyyyLLLddss = ():string => {
  const currentTime = DateTime.local();
  const pstTime = currentTime.setZone('America/Los_Angeles');
  return pstTime.toFormat('yyyyLLLddss');
};

export const getDateTimeString = (addHours?:number):string => {
  const now = DateTime.now();
  if(addHours){
    const plusHours = now.plus(Duration.fromObject({ hours: addHours }));
    return plusHours.toFormat('yyyy-MM-dd HH:mm:ss');
  }

  return now.toFormat('yyyy-MM-dd HH:mm:ss');
};

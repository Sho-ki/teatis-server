import { RewardEventType } from '@prisma/client';

const teatisPointSet:Record<RewardEventType, number> = {
  sendMessage: 20,
  completeWeeklyCheckIn: 200,
  achieveWeeklyGoal: 200,
  exchangePoints: -900,
  customPoints: 0,
};

export const getRewardEventPoint = (eventType: RewardEventType, point?:number): [RewardEventType, number] => {
  if(point) return [eventType, point];

  const pointValue = teatisPointSet[eventType];
  return [eventType, pointValue];
};

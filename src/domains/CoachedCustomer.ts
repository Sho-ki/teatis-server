import { CustomerCoachHistory } from '@prisma/client';
import { Coach } from './Coach';
import { Customer } from './Customer';

export interface CoachedCustomer extends Customer {
  daysSincePurchase?:number;
  sequenceBasedAutoMessageData?:SequenceBasedAutoMessageData;
  coach: Coach;
  customerCoachHistory: CustomerCoachHistory[];
}

export type CustomerDaysSincePurchase = Pick<CoachedCustomer, 'daysSincePurchase'>;

export interface SequenceBasedAutoMessageData {
  id?:number;
  lastSequentBasedMessageSequence?:number;
  lastSequentBasedMessageDate?:Date;
}


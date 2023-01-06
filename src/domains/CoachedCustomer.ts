import { Coach } from './Coach';
import { Customer } from './Customer';

export interface CoachedCustomer extends Customer {
  daysSincePurchase?:number;
  sequenceBasedAutoMessageData?:SequenceBasedAutoMessageData;
  coach:Coach;
}

export type CustomerDaysSincePurchase = Pick<CoachedCustomer, 'daysSincePurchase'>;

export interface SequenceBasedAutoMessageData {
  id?:number;
  lastSequentBasedMessageSequence?:number;
  lastSequentBasedMessageDate?:Date;
}


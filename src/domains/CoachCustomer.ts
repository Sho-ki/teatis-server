import { Coach } from './Coach';
import { Customer } from './Customer';

export interface CoachCustomer extends Customer {
  note:string;
  daysSincePurchase?:number;
  coach:Coach;
}

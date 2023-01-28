import { Answer } from './Answer';
import { Customer } from './Customer';

export interface CustomerAnswer extends Customer {
  customerAnswers: Answer[];
}

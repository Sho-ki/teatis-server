import { Customer } from './Customer';

export interface CustomerOrderCount extends Pick<Customer, 'email'> {
  orderCount: number;
}

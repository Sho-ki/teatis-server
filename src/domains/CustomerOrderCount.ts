import { Customer } from './Customer';

export class CustomerOrderCount implements Pick<Customer, 'email'> {
  email: string;
  orderCount: number;
}

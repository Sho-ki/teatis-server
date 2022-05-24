import { Order } from './Order';

export interface OrderQueue extends Order {
  customerId: number;
  status: 'scheduled' | 'ordered' | 'fulfilled';
}

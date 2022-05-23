import { Order } from './Order';

export class OrderQueue extends Order {
  customerId: number;
  status: 'scheduled' | 'ordered' | 'fulfilled';
}

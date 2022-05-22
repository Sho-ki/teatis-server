import { Order } from './Order';
import { Product } from './Product';

export class CustomerOrder implements Order {
  orderDate?: string;
  products: Pick<Product, 'sku'>[];
  orderNumber: string;
  orderId: string;
}

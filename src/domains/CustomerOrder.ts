import { Order } from './Order';
import { Product } from './Product';

export interface CustomerOrder extends Order {
  products: Pick<Product, 'sku'>[];
}

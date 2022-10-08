import { Product } from './Product';

export interface ProductOnHand extends Pick<Product, 'sku'> {
  onHand:number;
}

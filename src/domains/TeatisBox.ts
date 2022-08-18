import { Product } from './Product';

export interface TeatisBox {
  id: number;
  label: string;
  products: Product[];
}

export interface TeatisBoxProduct{
  teatisBoxId: number;
  productId: number;
}


import { Product } from './Product';

export interface TeatisBox {
  id: number;
  label: string;
  products: Product[];
  description?: string;
  note?: string;
}

export interface TeatisBoxProduct{
  teatisBoxId: number;
  productId: number;
}


import { Product } from './Product';

export interface MasterMonthlyBox {
  id: number;
  label: string;
  products: Product[];
  description?: string;
  note?: string;
}

export interface MasterMonthlyBoxProduct{
  masterMonthlyBoxId: number;
  productId: number;
}


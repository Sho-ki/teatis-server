import { DisplayProduct, Product } from './Product';

export interface PractitionerBox {
  label: string;
  note?: string;
  products: DisplayProduct[] | Product[];
}

import { DisplayProduct, Product } from './Product';

export interface PractitionerBox {
  id: number;
  uuid: string;
  label: string;
  note?: string;
  products: DisplayProduct[] | Product[];
}

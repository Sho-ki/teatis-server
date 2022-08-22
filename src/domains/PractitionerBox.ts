import { DisplayProduct, Product } from './Product';

export interface PractitionerBox {
  id: number;
  practitionerId?: number;
  uuid: string;
  label: string;
  description?: string;
  note?: string;
  products: DisplayProduct[] | Product[];
}

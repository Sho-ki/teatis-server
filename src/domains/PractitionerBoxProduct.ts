import { Practitioner } from './Practitioner';
import { PractitionerBox } from './PractitionerBox';
import { Product } from './Product';

export interface PractitionerBoxProduct extends Practitioner, PractitionerBox {
  product: Product[];
}

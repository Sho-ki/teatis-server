import { Practitioner } from './Practitioner';
import { PractitionerBox } from './PractitionerBox';
import { DisplayProduct } from './Product';

export interface PractitionerAndBox extends Practitioner {
  box: PractitionerBox;
}

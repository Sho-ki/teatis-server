import { Practitioner } from './Practitioner';
import { PractitionerBox } from './PractitionerBox';
import { DisplayProduct } from './Product';

export interface PractitionerSingleBox extends Practitioner {
  box: PractitionerBox;
}

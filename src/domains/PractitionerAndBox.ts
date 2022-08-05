import { Practitioner } from './Practitioner';
import { PractitionerBox } from './PractitionerBox';

export interface PractitionerAndBox extends Practitioner {
  box: PractitionerBox;
}

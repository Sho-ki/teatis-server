import { Practitioner } from './Practitioner';
import { PractitionerBox } from './PractitionerBox';
import { DisplayProduct } from './Product';
import { SocialMedia } from './SocialMedia';

export interface PractitionerSocialMediaBoxDisplayProduct
  extends Practitioner,
    SocialMedia,
    PractitionerBox {
  product: DisplayProduct[];
}

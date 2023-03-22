import { Country } from '@prisma/client';

export interface Address {
   address1 : string;
   address2? : string;
   city : string;
   zip : string;
   state : string;
   country : Country;
}

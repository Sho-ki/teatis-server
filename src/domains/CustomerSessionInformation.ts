import { CustomerSession } from '@prisma/client';
import { Customer } from './Customer';

export interface CustomerSessionInformation extends CustomerSession{
   customer:Customer;
}

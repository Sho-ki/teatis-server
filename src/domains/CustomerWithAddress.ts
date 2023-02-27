import { CustomerAddress } from '@prisma/client';
import { Customer } from './Customer';

export interface CustomerWithAddress extends Customer{
    customerAddress: CustomerAddress;
}

import { Customer } from './Customer';

export interface CustomerAndTerraCustomer extends Customer{
    terraCustomerId: string;
}

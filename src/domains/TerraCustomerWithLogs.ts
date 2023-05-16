import { TerraCustomer, TerraCustomerLog } from '@prisma/client';

export interface TerraCustomerWithLogs extends TerraCustomer  {
    terraCustomerLog: TerraCustomerLog[];
}

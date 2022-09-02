import { Injectable } from '@nestjs/common';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';

export interface GetTerraCustomersArgs {
  terraCustomerIds: string[];
}

export interface CustomerBoxRepositoryInterface {
  getTerraCustomers({ terraCustomerIds }: GetTerraCustomersArgs): Promise<ReturnValueType<Product[]>>;
}

@Injectable()
export class CustomerBoxRepository implements CustomerBoxRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async getTerraCustomers({ terraCustomerIds }: GetTerraCustomersArgs): Promise<ReturnValueType<Product[]>> {
    const response = await this.prisma.terraCustomer.findMany(
      {
        where:
            { OR: terraCustomerIds.map((id) => { return { terraCustomerId: id }; }) },
        select: { customer: { select: { id: true, email: true, uuid: true } }, id: true, terraCustomerId: true },
      });
    return [productsRes];
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { Transactionable } from '../../utils/transactionable.interface';
import { PrismaClient, Prisma, CustomerAddress, Country } from '@prisma/client';
import { ReturnValueType } from '../../../filter/customError';

interface UpsertCustomerAddressArgs {
    customerId: number;
    address1: string;
    address2?: string;
    city: string;
    zip: string;
    state: string;
    country: Country;
}

export interface CustomerAddressRepositoryInterface extends Transactionable {
  upsertCustomerAddress({ customerId, address1, address2, city, zip, state, country }: UpsertCustomerAddressArgs):
  Promise<ReturnValueType<CustomerAddress>>;
}

@Injectable()
export class CustomerAddressRepository
implements CustomerAddressRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CustomerAddressRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async upsertCustomerAddress(
    { customerId, address1, address2, city, zip, state, country }: UpsertCustomerAddressArgs):
    Promise<ReturnValueType<CustomerAddress>> {
    const response = await this.prisma.customerAddress.upsert(
      {
        where: { customerId },
        create: { address1, address2, city, zip, state, country, customerId },
        update: { address1, address2, city, zip, state, country },
      });
    return [response];
  }

}

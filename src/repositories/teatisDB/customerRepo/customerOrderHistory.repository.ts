import { Injectable } from '@nestjs/common';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';

export interface createCustomerOrderHistoryArgs {
  transactionPrice: number;
  orderNumber: string;
  status: 'ordered' | 'scheduled' | 'canceled' | 'fulfilled';
  customerId: number;
  practitionerBoxId: number;
}

export interface GetCustomerOrderHistoryProductsArgs {
  email: string;
}

export interface UpdateCustomerOrderHistoryArgs {
  customerId: number;
  products: Partial<Product>[];
}

export interface CustomerOrderHistoryRepoInterface {
  createPractitionerBoxOrderHistory({
    transactionPrice,
    orderNumber,
    status,
    customerId,
    practitionerBoxId,
  }: createCustomerOrderHistoryArgs): Promise<[void?, Error?]>;
}

@Injectable()
export class CustomerOrderHistoryRepo
  implements CustomerOrderHistoryRepoInterface
{
  constructor(private prisma: PrismaService) {}

  async createPractitionerBoxOrderHistory({
    transactionPrice,
    orderNumber,
    status,
    customerId,
    practitionerBoxId,
  }: createCustomerOrderHistoryArgs): Promise<[void?, Error?]> {
    try {
      await this.prisma.practitionerCustomerOrderHistory.create({
        data: {
          practitionerBoxId,
          customerId,
          orderNumber,
          status,
          transactionPrice,
        },
      });

      return [];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message:
            'Server Side Error: createPractitionerBoxOrderHistory failed',
        },
      ];
    }
  }
}

import { Injectable } from '@nestjs/common';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';

export interface UpdatePractitionerBoxOrderHistoryArgs {
  orderNumber: string;
  status: 'fulfilled';
}

export interface CreatePractitionerBoxOrderHistoryArgs {
  transactionPrice: number;
  orderNumber: string;
  status: 'ordered';
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

export interface PractitionerBoxOrderHistoryRepoInterface {
  createPractitionerBoxOrderHistory({
    transactionPrice,
    orderNumber,
    status,
    customerId,
    practitionerBoxId,
  }: CreatePractitionerBoxOrderHistoryArgs): Promise<[void?, Error?]>;

  updatePractitionerBoxOrderHistory({
    orderNumber,
    status,
  }: UpdatePractitionerBoxOrderHistoryArgs): Promise<[void?, Error?]>;
}

@Injectable()
export class PractitionerBoxOrderHistoryRepo
  implements PractitionerBoxOrderHistoryRepoInterface
{
  constructor(private prisma: PrismaService) {}
  async updatePractitionerBoxOrderHistory({
    orderNumber,
    status,
  }: UpdatePractitionerBoxOrderHistoryArgs): Promise<[void?, Error?]> {
    try {
      await this.prisma.practitionerCustomerOrderHistory.update({
        where: { orderNumber },
        data: {
          orderNumber,
          status,
        },
      });

      return [];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message:
            'Server Side Error: updatePractitionerBoxOrderHistory failed',
        },
      ];
    }
  }

  async createPractitionerBoxOrderHistory({
    transactionPrice,
    orderNumber,
    status,
    customerId,
    practitionerBoxId,
  }: CreatePractitionerBoxOrderHistoryArgs): Promise<[void?, Error?]> {
    try {
      await this.prisma.practitionerCustomerOrderHistory.upsert({
        where: { orderNumber },
        create: {
          practitionerBoxId,
          customerId,
          orderNumber,
          status,
          transactionPrice,
        },
        update: {},
      });

      return [];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message:
            'Server Side Error: updatePractitionerBoxOrderHistory failed',
        },
      ];
    }
  }
}

/* eslint-disable no-sparse-arrays */
/* eslint-disable comma-spacing */
import { Injectable } from '@nestjs/common';
import { Product } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '@Filters/customError';

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

export interface PractitionerBoxOrderHistoryRepositoryInterface {
  createPractitionerBoxOrderHistory({
    transactionPrice,
    orderNumber,
    status,
    customerId,
    practitionerBoxId,
  }: CreatePractitionerBoxOrderHistoryArgs): Promise<ReturnValueType<void>>;

  updatePractitionerBoxOrderHistory({
    orderNumber,
    status,
  }: UpdatePractitionerBoxOrderHistoryArgs): Promise<ReturnValueType<void>>;
}

@Injectable()
export class PractitionerBoxOrderHistoryRepository
implements PractitionerBoxOrderHistoryRepositoryInterface
{
  constructor(private prisma: PrismaService) {}
  async updatePractitionerBoxOrderHistory({
    orderNumber,
    status,
  }: UpdatePractitionerBoxOrderHistoryArgs): Promise<ReturnValueType<void>> {
    await this.prisma.practitionerCustomerOrderHistory.update({
      where: { orderNumber },
      data: {
        orderNumber,
        status,
      },
    });

    return [,];
  }

  async createPractitionerBoxOrderHistory({
    transactionPrice,
    orderNumber,
    status,
    customerId,
    practitionerBoxId,
  }: CreatePractitionerBoxOrderHistoryArgs): Promise<ReturnValueType<void>> {
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

    return [,];
  }
}

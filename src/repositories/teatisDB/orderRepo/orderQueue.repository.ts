import { Injectable } from '@nestjs/common';
import { OrderQueue } from '@Domains/OrderQueue';

import { PrismaService } from '../../../prisma.service';

export interface UpdateOrderQueueArgs {
  customerId: number;
  orderNumber: string;
  status: 'scheduled' | 'ordered' | 'fulfilled';
}

export interface OrderQueueRepoInterface {
  updateOrderQueue({
    customerId,
    orderNumber,
    status,
  }: UpdateOrderQueueArgs): Promise<[OrderQueue?, Error?]>;
}

@Injectable()
export class OrderQueueRepo implements OrderQueueRepoInterface {
  constructor(private prisma: PrismaService) {}

  async updateOrderQueue({
    customerId,
    orderNumber,
    status,
  }: UpdateOrderQueueArgs): Promise<[OrderQueue?, Error?]> {
    try {
      let actionDate = new Date();
      if (status === 'scheduled') {
        actionDate.setMinutes(actionDate.getMinutes() + 3);
      }

      const updateOrderQueueRes = await this.prisma.queuedShopifyOrder.upsert({
        where: { orderName: orderNumber },
        create: {
          scheduledAt: actionDate.toISOString(),
          status,
          orderName: orderNumber,
          customerId,
        },

        update:
          status === 'fulfilled'
            ? {
                fulfilledAt: actionDate.toISOString(),
                status,
              }
            : status === 'ordered'
            ? {
                orderedAt: actionDate.toISOString(),
                status,
              }
            : {},
      });

      if (!updateOrderQueueRes) {
        throw new Error();
      }
      return [
        {
          customerId: updateOrderQueueRes.customerId,
          status,
          orderNumber,
        },
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: updateOrderQueue failed',
        },
      ];
    }
  }
}

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrderQueue } from '../../../domains/OrderQueue';

import { PrismaService } from '../../../prisma.service';

interface UpdateOrderQueueArgs {
  customerId: number;
  orderNumber: string;
  status: 'scheduled' | 'ordered' | 'fulfilled';
}

interface UpdateOrderQueueRes {
  id: number;
  customerId: number;
}

export interface OrderQueueRepoInterface {
  updateOrderQueue({
    customerId,
    orderNumber,
    status,
  }: UpdateOrderQueueArgs): Promise<[UpdateOrderQueueRes, Error]>;
}

@Injectable()
export class OrderQueueRepo implements OrderQueueRepoInterface {
  constructor(private prisma: PrismaService) {}

  async updateOrderQueue({
    customerId,
    orderNumber,
    status,
  }: UpdateOrderQueueArgs): Promise<[UpdateOrderQueueRes, Error]> {
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
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: updateOrderQueue() failed',
        },
      ];
    }
    return [
      {
        id: updateOrderQueueRes.id,
        customerId: updateOrderQueueRes.customerId,
      },
      null,
    ];
  }
}

import { Injectable } from '@nestjs/common';
import { OrderQueue } from '@Domains/OrderQueue';

import { PrismaService } from '../../../prisma.service';
import { ReturnValueType } from '../../../filter/customError';

export interface UpdateOrderQueueArgs {
  customerId: number;
  orderNumber: string;
  status: 'scheduled' | 'ordered' | 'fulfilled';
}

export interface OrderQueueRepositoryInterface {
  updateOrderQueue({
    customerId,
    orderNumber,
    status,
  }: UpdateOrderQueueArgs): Promise<ReturnValueType<OrderQueue>>;
}

@Injectable()
export class OrderQueueRepository implements OrderQueueRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async updateOrderQueue({
    customerId,
    orderNumber,
    status,
  }: UpdateOrderQueueArgs): Promise<ReturnValueType<OrderQueue>> {
    let actionDate = new Date();
    if (status === 'scheduled') {
      actionDate.setMinutes(actionDate.getMinutes() + 3);
    }

    const response = await this.prisma.queuedShopifyOrder.upsert({
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

    return [
      {
        customerId: response.customerId,
        status,
        orderNumber,
        orderDate: response.orderedAt,
      },
    ];
  }
}

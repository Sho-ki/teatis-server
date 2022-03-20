import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../prisma.service';

interface PushOrderQueueArgs {
  email: string;
  orderNumber: string;
}

interface PushOrderQueueRes {
  id: number;
  customerId: number;
}

export interface OrderQueueRepoInterface {
  pushOrderQueue({
    email,
    orderNumber,
  }: PushOrderQueueArgs): Promise<[PushOrderQueueRes, Error]>;
}

@Injectable()
export class OrderQueueRepo implements OrderQueueRepoInterface {
  constructor(private prisma: PrismaService) {}

  async pushOrderQueue({
    email,
    orderNumber,
  }: PushOrderQueueArgs): Promise<[PushOrderQueueRes, Error]> {
    let scheduleData = new Date();
    scheduleData.setMinutes(scheduleData.getMinutes() + 3);

    const pushOrderQueueRes = await this.prisma.queuedShopifyOrder.upsert({
      where: { orderName: orderNumber },
      create: {
        scheduledAt: scheduleData.toISOString(),
        status: 'queue',
        orderName: orderNumber,
        customerId: (
          await this.prisma.customers.findUnique({ where: { email } })
        ).id,
      },
      update: {},
    });

    if (!pushOrderQueueRes) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: pushOrderQueue() failed',
        },
      ];
    }
    return [
      { id: pushOrderQueueRes.id, customerId: pushOrderQueueRes.customerId },
      null,
    ];
  }
}

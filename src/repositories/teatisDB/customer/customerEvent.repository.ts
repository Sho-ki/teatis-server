import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import { Prisma } from '@prisma/client';

type EventType = 'boxUnsubscribed'|'boxSubscribed'|'coachingUnsubscribed'|'coachingSubscribed';

export interface AddCustomerEventLogArgs {
  customerId: number;
  type: EventType | EventType[];
  eventDate?:Date;
}

export interface CustomerEventRepositoryInterface {
  addCustomerEventLog({ customerId, type, eventDate }: AddCustomerEventLogArgs): Promise<void>;
}

@Injectable()
export class CustomerEventRepository implements CustomerEventRepositoryInterface {
  constructor(private prisma: PrismaService) {}

  async addCustomerEventLog({ customerId, type, eventDate = new Date() }: AddCustomerEventLogArgs):
   Promise<void> {
    let data:Prisma.CustomerEventLogCreateManyArgs;
    if (typeof type === 'string') {
      data = { data: { eventDate, customerId, type } };
    } else if (Array.isArray(type)) {
      data = {
        data: type.map((t) => {
          return { eventDate, customerId, type: t };
        } ),
      };
    }
    await this.prisma.customerEventLog.createMany(data);

    return;
  }

}

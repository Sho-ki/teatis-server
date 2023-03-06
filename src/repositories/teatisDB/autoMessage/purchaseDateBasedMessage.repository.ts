import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import {  AutoMessageMedia, PurchaseDateBasedAutoMessage } from '../../../domains/AutoMessage';
import { CustomerDaysSincePurchase } from '../../../domains/CoachedCustomer';

interface GetCustomerDaysSincePurchaseArgs {
    customerId: number;
}

interface GetPurchaseDateBasedAutoMessagesByDaysArgs{
    days: number[];
}

export interface PurchaseDateBasedMessageRepositoryInterface {
  getCustomerDaysSincePurchase({ customerId }: GetCustomerDaysSincePurchaseArgs):
  Promise<CustomerDaysSincePurchase>;

  getPurchaseDateBasedAutoMessagesByDays({ days }:GetPurchaseDateBasedAutoMessagesByDaysArgs):
  Promise<PurchaseDateBasedAutoMessage[]>;

}

@Injectable()
export class PurchaseDateBasedMessageRepository
implements PurchaseDateBasedMessageRepositoryInterface
{
  constructor(private prisma: PrismaService) {}
  async getPurchaseDateBasedAutoMessagesByDays({ days }: GetPurchaseDateBasedAutoMessagesByDaysArgs):
  Promise<PurchaseDateBasedAutoMessage[]> {
    const response = await this.prisma.purchaseDateBasedMessage.findMany(
      {
        where: { delayDaysSincePurchase: { in: days } },
        include: {
          purchaseDateBasedAutoMessageContent: {
            include: { purchaseDateBasedAutoMessageMedia: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
    if(!response.length){
      return [];
    }

    const autoMessages: PurchaseDateBasedAutoMessage[] = response.map((
      { id, delayDaysSincePurchase, purchaseDateBasedAutoMessageContent }):PurchaseDateBasedAutoMessage => ({
      id,
      delayDaysSincePurchase,
      type: 'purchaseDateBased',
      body: purchaseDateBasedAutoMessageContent[0].body,
      media: purchaseDateBasedAutoMessageContent[0].purchaseDateBasedAutoMessageMedia.map((
        { urlTemplate, type }):AutoMessageMedia => {
        return {
          urlTemplate,
          type,
        };
      }),
    }));

    return autoMessages;
  }

  async getCustomerDaysSincePurchase(
    { customerId }: GetCustomerDaysSincePurchaseArgs):
     Promise<CustomerDaysSincePurchase> {
    const response = await this.prisma.customerEventLog.findFirst(
      { where: { customerId, type: 'boxSubscribed', customer: { coachingSubscribed: 'active' } }, orderBy: { eventDate: 'desc' } });

    const today = new Date();
    const startDate = response?.eventDate || today;
    const elapsedTime = today.getTime() - startDate.getTime();
    const daysSincePurchase = Math.floor(elapsedTime / 86400000);

    // eslint-disable-next-line no-console
    console.log(
      { today, startDate, daysSincePurchase }
    );
    return { daysSincePurchase };
  }

}

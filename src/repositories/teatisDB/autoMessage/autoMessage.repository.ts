import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import {  AutoMessageMedia, PurchaseDateBasedAutoMessage, SequenceBasedAutoMessage } from '../../../domains/AutoMessage';
import { CustomerDaysSincePurchase, SequenceBasedAutoMessageData } from '../../../domains/CoachedCustomer';
import { IntermediateCustomerSequenceBasedAutoMessageHistory } from '@prisma/client';

interface GetCustomerDaysSincePurchaseArgs {
    customerId: number;
}

interface GetCustomerLastSequenceBasedAutoMessageDataArgs {
    customerId: number;
}

interface GetPurchaseDateBasedAutoMessagesByDaysArgs{
    days: number[];
}

interface GetSequenceBasedAutoMessagesBySequencesArgs{
    sequences: number[];
}

interface CreateCustomerSequenceBasedAutoMessagesHistoryArgs{
    sequenceBasedAutoMessageId: number;
    customerId:number;
}

export interface AutoMessageRepositoryInterface {
  getCustomerDaysSincePurchase({ customerId }: GetCustomerDaysSincePurchaseArgs):
  Promise<CustomerDaysSincePurchase>;

  getCustomerLastSequenceBasedAutoMessageData({ customerId }:
    GetCustomerLastSequenceBasedAutoMessageDataArgs):Promise<SequenceBasedAutoMessageData>;

  getPurchaseDateBasedAutoMessagesByDays({ days }:GetPurchaseDateBasedAutoMessagesByDaysArgs):
  Promise<PurchaseDateBasedAutoMessage[]>;

  getSequenceBasedAutoMessagesBySequences({ sequences }:GetSequenceBasedAutoMessagesBySequencesArgs):
  Promise<SequenceBasedAutoMessage[]>;

  createCustomerSequenceBasedAutoMessagesHistory({ customerId, sequenceBasedAutoMessageId }
    :CreateCustomerSequenceBasedAutoMessagesHistoryArgs):Promise<IntermediateCustomerSequenceBasedAutoMessageHistory>;

}

@Injectable()
export class AutoMessageRepository
implements AutoMessageRepositoryInterface
{
  constructor(private prisma: PrismaService) {}
  async createCustomerSequenceBasedAutoMessagesHistory({ customerId, sequenceBasedAutoMessageId }:
    CreateCustomerSequenceBasedAutoMessagesHistoryArgs): Promise<IntermediateCustomerSequenceBasedAutoMessageHistory> {
    return await this.prisma.intermediateCustomerSequenceBasedAutoMessageHistory.create(
      { data: { customerId, sequenceBasedAutoMessageId } }
    );
  }

  async getSequenceBasedAutoMessagesBySequences({ sequences }: GetSequenceBasedAutoMessagesBySequencesArgs):
  Promise<SequenceBasedAutoMessage[]> {
    const response = await this.prisma.sequenceBasedAutoMessage.findMany(
      {
        where: { sequence: { in: sequences } },
        include: {
          sequenceBasedAutoMessageContent: {
            include: { sequenceBasedAutoMessageMedia: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
    if(!response.length){
      return [];
    }

    const autoMessages: SequenceBasedAutoMessage[] = response.map((
      { id, sequence, sequenceBasedAutoMessageContent }):SequenceBasedAutoMessage => ({
      id,
      sequence,
      type: 'sequenceBased',
      body: sequenceBasedAutoMessageContent[0].body,
      media: sequenceBasedAutoMessageContent[0].sequenceBasedAutoMessageMedia.map((
        { urlTemplate, type }):AutoMessageMedia => {
        return {
          urlTemplate,
          type,
        };
      }),
    }));

    return autoMessages;

  }

  async getCustomerLastSequenceBasedAutoMessageData({ customerId }:
    GetCustomerLastSequenceBasedAutoMessageDataArgs):Promise<SequenceBasedAutoMessageData> {
    const response = await this.prisma.intermediateCustomerSequenceBasedAutoMessageHistory.findFirst(
      { where: { customerId, customer: { coachingSubscribed: 'active' } }, orderBy: { sentAt: 'desc' }, include: { sequenceBasedAutoMessage: true, customer: true } });

    if(!response)return {}; // When the customer has no message history

    return {
      id: response.sequenceBasedAutoMessageId,
      lastSequentBasedMessageSequence: response.sequenceBasedAutoMessage.sequence,
      lastSequentBasedMessageDate: response.sentAt,
    };
  }

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
    const startDate = response.eventDate;

    const elapsedTime = today.getTime() - startDate.getTime();
    const daysSincePurchase = Math.floor(elapsedTime / 86400000);
    return { daysSincePurchase };
  }

}

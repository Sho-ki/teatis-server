import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';
import {  AutoMessageMedia, SequenceBasedAutoMessage } from '../../../domains/AutoMessage';
import { SequenceBasedAutoMessageData } from '../../../domains/CoachedCustomer';
import { IntermediateCustomerSequenceBasedAutoMessageHistory } from '@prisma/client';

interface GetCustomerLastSequenceBasedAutoMessageDataArgs {
    customerId: number;
}

interface GetSequenceBasedAutoMessagesBySequencesArgs{
    sequences: number[];
}

interface CreateCustomerSequenceBasedAutoMessagesHistoryArgs{
    sequenceBasedAutoMessageId: number;
    customerId:number;
}

export interface SequentBasedMessageRepositoryInterface {
  getCustomerLastSequenceBasedAutoMessageData({ customerId }:
    GetCustomerLastSequenceBasedAutoMessageDataArgs):Promise<SequenceBasedAutoMessageData>;

  getSequenceBasedAutoMessagesBySequences({ sequences }:GetSequenceBasedAutoMessagesBySequencesArgs):
  Promise<SequenceBasedAutoMessage[]>;

  createCustomerSequenceBasedAutoMessagesHistory({ customerId, sequenceBasedAutoMessageId }
    :CreateCustomerSequenceBasedAutoMessagesHistoryArgs):Promise<IntermediateCustomerSequenceBasedAutoMessageHistory>;

}

@Injectable()
export class SequentBasedMessageRepository
implements SequentBasedMessageRepositoryInterface
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

}

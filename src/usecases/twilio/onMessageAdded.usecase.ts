import {  Inject, Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';
import { TwilioEvent } from '../../domains/twilioEvent';
import { Customer } from '../../domains/Customer';
import { CustomerGeneralRepositoryInterface } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerTwilioMessageRepositoryInterface } from '../../repositories/teatisDB/customerTwilioMessage/customerTwilioMessage.repository';
import { getRewardEventPoint } from '../utils/teatisPointSet';
import { TransactionOperatorInterface } from '../../repositories/utils/transactionOperator';

export interface OnMessageAddedUsecaseInterface {
  onMessageAdded(body:TwilioEvent): Promise<ReturnValueType<Customer>>;
}

@Injectable()
export class OnMessageAddedUsecase
implements OnMessageAddedUsecaseInterface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerTwilioMessageRepositoryInterface')
    private readonly customerTwilioMessageRepository: CustomerTwilioMessageRepositoryInterface,
    @Inject('TransactionOperatorInterface')
    private readonly transactionOperator: TransactionOperatorInterface,
  ) {}

  async onMessageAdded(body:TwilioEvent): Promise<ReturnValueType<Customer>> {
    const twilioChannelSid = body.ConversationSid;
    const messageId = body.MessageSid;

    // Step 0: Find the customer by channelSid
    const [customer] = await this.customerGeneralRepository.getCustomerByTwilioChannelSid({ twilioChannelSid });

    // Step 1: Check if the MessageId exists in the CustomerTwilioMessage table
    const [existingMessage] = await this.customerTwilioMessageRepository.findMessageByMessageId({ messageId });
    if (existingMessage) return [customer];

    // Insert the record in a transaction
    const [customerResponse] = await this.transactionOperator
      .performAtomicOperations(
        [this.customerGeneralRepository, this.customerTwilioMessageRepository],
        async (): Promise<ReturnValueType<Customer>> => {
          await this.customerTwilioMessageRepository.createMessage(
            { customerId: customer.id, messageId, sentAt: new Date(body.DateCreated)  });

          // Step 2: Add a record in teatisPointLog
          const [type, points] = getRewardEventPoint('sendMessage');

          const [newCustomer] = await
          this.customerGeneralRepository.updateTotalPoints({ customerId: customer.id, points, type });
          return [newCustomer];
        });
    return [customerResponse];

  }
}

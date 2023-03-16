import { Inject, Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';
import { TwilioRepository } from '../../repositories/twilio/twilio.repository';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

export interface CreateCustomerConversationSummaryUsecaseInterface {
    createCustomerConversationSummary(): Promise<ReturnValueType<unknown>>;
}

@Injectable()
export class CreateCustomerConversationSummaryUsecase
implements CreateCustomerConversationSummaryUsecaseInterface {
  constructor(
    @Inject('TwilioRepositoryInterface')
    private twilioRepository: TwilioRepository,
  ){}
  async createCustomerConversationSummary(): Promise<ReturnValueType<MessageInstance[]>> {
    const [res, error] = await this.twilioRepository.getInboundConversations();
    if(error){
      return [undefined, error];
    }
    const newMessages = res
      .sort((a, b) => +new Date(b.dateUpdated) - +new Date(a.dateUpdated))
      .filter((message, index, array) => {
        // Check if this message has the same from and to phone numbers as any previous message
        const hasDuplicate = array.slice(0, index).some(previousMessage => {
          return previousMessage.from === message.from && previousMessage.to === message.to;
        });
        return !hasDuplicate;
      });
    return [newMessages];
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';
import { TwilioRepository } from '../../repositories/twilio/twilio.repository';

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
  async createCustomerConversationSummary(): Promise<ReturnValueType<unknown>> {
    const [res, error] = await this.twilioRepository.getAllConversations();
    return;
    if(error){
      return [undefined, error];
    }
    return [{ success: true }];
  }
}

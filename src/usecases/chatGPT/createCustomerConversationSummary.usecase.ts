import { Inject, Injectable } from '@nestjs/common';
import { ReturnValueType } from '@Filters/customError';
import { TwilioRepository } from '../../repositories/twilio/twilio.repository';
import { CustomerGeneralRepository } from '../../repositories/teatisDB/customer/customerGeneral.repository';

export interface CreateCustomerConversationSummaryUsecaseInterface {
    createCustomerConversationSummary(): Promise<ReturnValueType<unknown>>;
}

@Injectable()
export class CreateCustomerConversationSummaryUsecase
implements CreateCustomerConversationSummaryUsecaseInterface {
  constructor(
    @Inject('TwilioRepositoryInterface')
    private twilioRepository: TwilioRepository,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepository,
  ){}
  async createCustomerConversationSummary(): Promise<ReturnValueType<unknown>> {
    const [res, error] = await this.twilioRepository.getInboundConversations();
    if(error){
      return [undefined, error];
    }
    const uniquePhoneNumbers = new Set(res.map(r => r.from));
    const [getCustomersRes, getCustomersError] =
      await this.customerGeneralRepository.getCustomersByPhone({ phoneNumbers: [...uniquePhoneNumbers] });
    if (getCustomersError) {
      return [undefined, getCustomersError];
    }
    const customersChannelSids = getCustomersRes.map(customer => customer.twilioChannelSid);
    return [{}];
  }
}

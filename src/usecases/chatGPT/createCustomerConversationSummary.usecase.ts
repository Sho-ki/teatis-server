import { Inject, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ReturnValueType } from '../../filter/customError';
import { TwilioRepository } from '../../repositories/twilio/twilio.repository';
import { CustomerGeneralRepository } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { coachingNotePrompt } from '../utils/coachingNote';
import { CoachRepository } from '../../repositories/teatisDB/coach/coach.repository';
import { yyyyLLLddss } from '../../usecases/utils/dates';
import { Prisma } from '@prisma/client';

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
    @Inject('CoachRepositoryInterface')
    private coachRepository: CoachRepository,
  ){}
  private errorStack: Error[] = [];
  async createCustomerConversationSummary(): Promise<ReturnValueType<Prisma.BatchPayload>> {
    const [inboundConversations] =
      await this.twilioRepository.getInboundConversations();
    if(!inboundConversations.length) return [{ count: -1 }];
    const uniquePhoneNumbers = new Set(inboundConversations.map(r => r.from));
    const [customers, getCustomersError] =
      await this.customerGeneralRepository.getCustomersByPhone({ phoneNumbers: [...uniquePhoneNumbers] });
    if (getCustomersError) {
      return [undefined, getCustomersError];
    }
    const updateCustomersList = [];
    const configuration = new Configuration({ apiKey: process.env.CHATGPT_API_KEY });
    const openai = new OpenAIApi(configuration);
    for (const customer of customers) {
      console.log('customer: ', customer.id);
      try {
        const conversationHistory =
          await this.twilioRepository.getConversationHistory({ customerChannelId: customer.twilioChannelSid });
        const [getCustomerDetail, _] =
          await this.coachRepository.getCustomerDetail({ id: customer.id });
        const conversation = JSON.stringify(conversationHistory.slice(conversationHistory.length-20));
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `${coachingNotePrompt} ${conversation}` }],
        });
        const gptReply = completion.data.choices[0].message.content;
        const summary = `updatedAt: ${yyyyLLLddss()} \n ${gptReply}`;
        const customerDetailsWithSummary = {
          customerCoachHistoryId: getCustomerDetail.customerCoachHistory[0].id,
          summary,
        };
        updateCustomersList.push(customerDetailsWithSummary);
      } catch(e) {
        this.errorStack.push(e);
      }
    }
    console.log('errorStack: ', this.errorStack);
    console.log('updateCustomersList.length: ', updateCustomersList.length);
    const [bulkInsertCustomerConversationSummary] =
      await this.coachRepository.bulkInsertCustomerConversationSummary(updateCustomersList);
    console.log('bulkInsertCustomerConversationSummary: ', bulkInsertCustomerConversationSummary);
    if (!this.errorStack.length) {
      throw Error(JSON.stringify(this.errorStack));
    }
    return [bulkInsertCustomerConversationSummary];
  }
}

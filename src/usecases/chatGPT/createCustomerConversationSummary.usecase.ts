import { Inject, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ReturnValueType } from '@Filters/customError';
import { TwilioRepository } from '../../repositories/twilio/twilio.repository';
import { CustomerGeneralRepository } from '../../repositories/teatisDB/customer/customerGeneral.repository';
import { coachingNotePrompt } from '../utils/coachingNote';
import { CoachRepository } from '../../repositories/teatisDB/coach/coach.repository';

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
  async createCustomerConversationSummary(): Promise<ReturnValueType<unknown>> {
    const [inboundConversations] =
      await this.twilioRepository.getInboundConversations();
    if(!inboundConversations.length) return [[]];
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
      try {
        const conversationHistory =
          await this.twilioRepository.getConversationHistory({ customerChannelId: customer.twilioChannelSid });
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `${coachingNotePrompt} ${JSON.stringify(conversationHistory.slice(conversationHistory.length-20))}` }],
        });

        const gptReply = completion.data.choices[0].message.content;
        const customerDetailsWithSummary = {
          customerId: customer.id,
          coachId: customer.coachId,
          conversationSummary: gptReply,
        };
        updateCustomersList.push(customerDetailsWithSummary);
      } catch(e) {
        this.errorStack.push(e);
      }
    }
    const [bulkInsertCustomerConversationSummary] =
      await this.coachRepository.bulkInsertCustomerConversationSummary(updateCustomersList);
    if (!this.errorStack.length) {
      throw Error(JSON.stringify(this.errorStack));
    }
    return [bulkInsertCustomerConversationSummary];
  }
}

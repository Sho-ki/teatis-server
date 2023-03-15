import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { TwilioCustomerDetail } from '@Domains/TwilioCustomerDetail';
import { CoachRepositoryInterface } from '@Repositories/teatisDB/coach/coach.repository';
import { Configuration, OpenAIApi } from 'openai';
import { TwilioRepository } from '../../repositories/twilio/twilio.repository';
import { coachingNotePrompt } from '../utils/coachingNote';
import { CustomerSurveyResponseRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { SurveyName } from '../utils/surveyName';

export interface GetCustomerDetailUsecaseInterface {
  getCustomerDetail(id:number): Promise<ReturnValueType<TwilioCustomerDetail>>;
}

@Injectable()
export class GetCustomerDetailUsecase
implements GetCustomerDetailUsecaseInterface
{
  constructor(
    @Inject('CoachRepositoryInterface')
    private coachedCustomerRepository: CoachRepositoryInterface,
    @Inject('TwilioRepositoryInterface')
    private twilioRepository: TwilioRepository,
    @Inject('CustomerSurveyResponseRepositoryInterface')
    private customerSurveyResponseRepository: CustomerSurveyResponseRepositoryInterface,

  ) {}

  async getCustomerDetail(id:number): Promise<ReturnValueType<TwilioCustomerDetail>> {
    const [customerDetail, getCustomerDetailError] =
      await this.coachedCustomerRepository.getCustomerDetail({ id });
    if (getCustomerDetailError) {
      return [undefined, getCustomerDetailError];
    }
    const { phone, coach,  firstName, lastName, twilioChannelSid } = customerDetail;
    let displayName = `customer ${id}`;
    if(firstName && lastName) displayName = `${firstName} ${lastName}`;
    else if(firstName) displayName = firstName;

    const [customerSurveyResponses] = await
    this.customerSurveyResponseRepository.getCustomerSurveyResponsesWithSurveyQuestionOptions(
      { surveyName: SurveyName.PrePurchase, customerId: id });

    for(const question of customerSurveyResponses) {
      if(question.surveyQuestion.responseType !== 'single') continue;

      const responseOptionId = question.response;
      const responseOption = question.surveyQuestion.surveyQuestionOptions?.find(({ id }) => id === responseOptionId);

      if(responseOption) question.response = responseOption.label;
    }

    const coachingNote = `
    Age: ${customerSurveyResponses.find(({ surveyQuestion }) => surveyQuestion.name === 'age')?.response || 'N/A'} \n
    Weight: ${customerSurveyResponses.find(({ surveyQuestion }) => surveyQuestion.name === 'weight')?.response || 'N/A'} \n
    Height: ${customerSurveyResponses.find(({ surveyQuestion }) => surveyQuestion.name === 'height')?.response || 'N/A'} \n
    Gender: ${customerSurveyResponses.find(({ surveyQuestion }) => surveyQuestion.name === 'gender')?.response || 'N/A'} \n
    Diabetes level: ${customerSurveyResponses.find(({ surveyQuestion }) => surveyQuestion.name === 'diabetes')?.response || 'N/A'} \n
    `;
    const conversationHistory =
    await this.twilioRepository.getConversationHistory({ customerChannelId: twilioChannelSid });
    const configuration = new Configuration({ apiKey: process.env.CHATGPT_API_KEY });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `${coachingNotePrompt} ${JSON.stringify(conversationHistory.slice(conversationHistory.length-20))}` }],
    });

    const gptReply = completion.data.choices[0].message.content;

    const fullInformation = `
    For full information, please visit https://teatis.retool.com/embedded/public/de87e7ff-ffc9-4d84-95a9-2c0ab41590d6?uuid=${customerDetail.uuid} \n
    ${coachingNote} 
    ${gptReply}`;
    const twilioCustomers:TwilioCustomerDetail =
      {
        objects: {
          customer: {
            customer_id: id,
            display_name: displayName,
            channels: [{ type: 'sms', value: phone }],
            details: {
              title: 'Customer note',
              content: fullInformation,
            },
            worker: coach.email, // assign this customer to a worker
            address: phone,
          },

        },
      };

    return [twilioCustomers, undefined];
  }
}

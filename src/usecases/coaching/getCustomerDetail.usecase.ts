import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { TwilioCustomerDetail } from '@Domains/TwilioCustomerDetail';
import { CoachRepositoryInterface } from '@Repositories/teatisDB/coach/coach.repository';
import { CustomerSurveyResponseRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { SurveyName } from '../../shared/constants/surveyName';

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
    @Inject('CustomerSurveyResponseRepositoryInterface')
    private customerSurveyResponseRepository: CustomerSurveyResponseRepositoryInterface,

  ) {}

  async getCustomerDetail(id:number): Promise<ReturnValueType<TwilioCustomerDetail>> {
    const [customerDetail, getCustomerDetailError] =
      await this.coachedCustomerRepository.getCustomerDetail({ id });
    if (getCustomerDetailError) {
      return [undefined, getCustomerDetailError];
    }
    const { phone, coach,  firstName, lastName } = customerDetail;
    let displayName = `customer ${id}`;
    if(firstName && lastName) displayName = `${firstName} ${lastName}`;
    else if(firstName) displayName = firstName;

    const [customerSurveyResponses] = await
    this.customerSurveyResponseRepository.getCustomerSurveyResponses(
      { surveyName: SurveyName.PrePurchase, customerId: id });

    for(const question of customerSurveyResponses) {
      if(question.surveyQuestion.responseType !== 'single') continue;

      const responseOptionId = question.response;
      const responseOption = question.surveyQuestion.surveyQuestionOptions?.find(({ id }) => id === responseOptionId);

      if(responseOption) question.response = responseOption.label;
    }

    const getResponse = (name) => customerSurveyResponses.find(({ surveyQuestion }) => surveyQuestion.name === name)?.response || 'N/A';

    const coachingNote = `
      Age: ${getResponse('age')}\n
      Weight: ${getResponse('weight')}\n
      Height: ${getResponse('height')}\n
      Gender: ${getResponse('gender')}\n
      Diabetes level: ${getResponse('diabetes')}\n
    `;

    const [latestConversationSummary, getLatestConversationSummaryError] =
      await this.coachedCustomerRepository.getLatestConversationSummary({ id });

    const summary = (!getLatestConversationSummaryError && latestConversationSummary)
      ? latestConversationSummary.summary
      : undefined;
    const fullInformation = `
      For full information, please visit https://teatis.retool.com/embedded/public/de87e7ff-ffc9-4d84-95a9-2c0ab41590d6?uuid=${customerDetail.uuid} \n
      ${coachingNote} 
      ${summary || `No summary available`}
    `;
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

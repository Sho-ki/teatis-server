import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerSurveyResponseRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { CustomerSurveyHistoryRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponseHistory.repository';
import { SurveyName } from '../utils/surveyName';
import { SurveyQuestionResponse } from '@prisma/client';
import { PostWeeklyCheckInDto } from '@Controllers/discoveries/weeklyCheckIn/dtos/postWeeklyCheckIn';

export interface PostWeeklyCheckInQuestionsUsecaseInterface {
    postWeeklyCheckInQuestions({ uuid, customerResponses }: PostWeeklyCheckInDto): Promise<
    ReturnValueType<SurveyQuestionResponse[]>
  >;
}

@Injectable()
export class PostWeeklyCheckInQuestionsUsecase
implements PostWeeklyCheckInQuestionsUsecaseInterface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerSurveyResponseRepositoryInterface')
    private customerSurveyResponseRepository: CustomerSurveyResponseRepositoryInterface,
    @Inject('CustomerSurveyHistoryRepositoryInterface')
    private customerSurveyHistoryRepository: CustomerSurveyHistoryRepositoryInterface,
  ) {}
  async postWeeklyCheckInQuestions({ uuid, customerResponses }: PostWeeklyCheckInDto): Promise<
    ReturnValueType<SurveyQuestionResponse[]>
  > {
    const [customer, getCustomerError] =
        await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if(getCustomerError){
      return [undefined, getCustomerError];
    }

    const customerSurveyHistory = await this.customerSurveyHistoryRepository.createCustomerSurveyHistory(
      { customerId: customer.id, surveyName: SurveyName.WeeklyCheckIn  });

    const surveyQuestionResponses = await Promise.all(customerResponses.map((customerResponse) => {
      return this.customerSurveyResponseRepository.upsertCustomerResponse(
        {
          surveyHistoryId: customerSurveyHistory.id,
          surveyQuestionResponseId: customerSurveyHistory?.surveyQuestionResponse?.find(({ surveyQuestionId }) =>
          { return surveyQuestionId === customerResponse.surveyQuestionId; })?.id,

          customerResponse: customerResponse.response,
          surveyQuestionId: customerResponse.surveyQuestionId,
        }); }));

    return [surveyQuestionResponses];
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { PostPrePurchaseSurvey2Dto } from '@Controllers/discoveries/dtos/postPrePurchaseSurvey2';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerSurveyResponseRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { CustomerSurveyHistoryRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponseHistory.repository';
import { SurveyName } from '../utils/surveyName';
import { SurveyQuestionResponse } from '@prisma/client';

export interface PostPrePurchaseSurveyUsecase2Interface {
  postPrePurchaseSurvey({ customerUuid, customerResponses }: PostPrePurchaseSurvey2Dto): Promise<
    ReturnValueType<SurveyQuestionResponse[]>
  >;
}

@Injectable()
export class PostPrePurchaseSurveyUsecase2
implements PostPrePurchaseSurveyUsecase2Interface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerSurveyResponseRepositoryInterface')
    private customerSurveyResponseRepository: CustomerSurveyResponseRepositoryInterface,
    @Inject('CustomerSurveyHistoryRepositoryInterface')
    private customerSurveyHistoryRepository: CustomerSurveyHistoryRepositoryInterface,
  ) {}
  async postPrePurchaseSurvey({ customerUuid, customerResponses }: PostPrePurchaseSurvey2Dto): Promise<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReturnValueType<SurveyQuestionResponse[]>
  > {
    const [customer, getCustomerError] =
        await this.customerGeneralRepository.getCustomerByUuid({ uuid: customerUuid });
    if(getCustomerError){
      return [undefined, getCustomerError];
    }

    const { id } = customer;

    // eslint-disable-next-line prefer-const
    let [customerSurveyHistory, noCustomerSurveyHistory] =
    await this.customerSurveyHistoryRepository.getCustomerSurveyHistory(
      { customerId: id, surveyName: SurveyName.PrePurchase });

    if (noCustomerSurveyHistory) {
      customerSurveyHistory = await this.customerSurveyHistoryRepository.createCustomerSurveyHistory(
        { customerId: customer.id, surveyName: SurveyName.PrePurchase  });
    }

    const surveyQuestionResponses = await Promise.all(customerResponses.map((customerResponse) => {
      return this.customerSurveyResponseRepository.upsertCustomerResponse(
        {
          surveyHistoryId: customerSurveyHistory.id,
          surveyQuestionResponseId: customerSurveyHistory?.surveyQuestionResponse?.find(({ surveyQuestionId }) =>
          { return surveyQuestionId === customerResponse.surveyQuestionId; })?.id,

          customerResponse: customerResponse.responseIds,
          surveyQuestionId: customerResponse.surveyQuestionId,
        }); }));

    // const [updateHistoryAndResponse, updateHistoryAndResponseError] =
    //     await this.customerSurveyResponseRepository.upsertCustomerResponse({
    //       surveyId,
    //       customerId: id,
    //       customerResponses,
    //     });
    // if(updateHistoryAndResponseError){
    //   return [undefined, updateHistoryAndResponseError];
    // }
    return [surveyQuestionResponses];
  }
}

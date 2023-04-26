import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { PostPrePurchaseSurveyNonSettingDto } from '@Controllers/discoveries/prePurchaseSurvey/dtos/postPrePurchaseSurveyNonSetting.dto';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerSurveyResponseRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { CustomerSurveyHistoryRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponseHistory.repository';
import { SurveyQuestionResponse } from '@prisma/client';

export interface PostPrePurchaseSurveyNonSettingUsecaseInterface {
  postPrePurchaseSurvey({ uuid, customerResponses, surveyName }: PostPrePurchaseSurveyNonSettingDto): Promise<
    ReturnValueType<SurveyQuestionResponse[]>
  >;
}

@Injectable()
export class PostPrePurchaseSurveyNonSettingUsecase
implements PostPrePurchaseSurveyNonSettingUsecaseInterface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerSurveyResponseRepositoryInterface')
    private customerSurveyResponseRepository: CustomerSurveyResponseRepositoryInterface,
    @Inject('CustomerSurveyHistoryRepositoryInterface')
    private customerSurveyHistoryRepository: CustomerSurveyHistoryRepositoryInterface,
  ) {}
  async postPrePurchaseSurvey({ uuid, customerResponses, surveyName }: PostPrePurchaseSurveyNonSettingDto): Promise<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReturnValueType<SurveyQuestionResponse[]>
  > {
    const [customer, getCustomerError] =
        await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if(getCustomerError){
      return [undefined, getCustomerError];
    }

    const { id } = customer;

    let [customerSurveyHistory] =
    await this.customerSurveyHistoryRepository.getCustomerSurveyHistory(
      { customerId: id, surveyName });

    if (!customerSurveyHistory) {
      customerSurveyHistory = await this.customerSurveyHistoryRepository.createCustomerSurveyHistory(
        { customerId: customer.id, surveyName  });
    }

    const surveyQuestionResponses = await Promise.all(customerResponses.map((customerResponse) => {
      return this.customerSurveyResponseRepository.upsertCustomerResponse(
        {
          surveyHistoryId: customerSurveyHistory.id,
          surveyQuestionResponseId: customerSurveyHistory?.surveyQuestionResponse?.find(({ surveyQuestionId }) =>
          { return surveyQuestionId === customerResponse.surveyQuestionId; })?.id,

          customerResponse: customerResponse.responseIds || customerResponse.responseId,
          surveyQuestionId: customerResponse.surveyQuestionId,
        }); }));

    return [surveyQuestionResponses];
  }
}

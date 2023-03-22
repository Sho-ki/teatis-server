import { Inject, Injectable } from '@nestjs/common';

import { PostPostPurchaseSurveyDto } from '@Controllers/discoveries/dtos/postPostPurchaseSurvey';
import { ReturnValueType } from '@Filters/customError';
import {  CustomerSurveyResponseRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { SurveyQuestionResponse } from '@prisma/client';

export interface PostPostPurchaseSurveyUsecaseInterface {
  postPostPurchaseSurvey({
    historyId,
    customerResponses,
  }: PostPostPurchaseSurveyDto): Promise<ReturnValueType<SurveyQuestionResponse[]>>;
}

@Injectable()
export class PostPostPurchaseSurveyUsecase
implements PostPostPurchaseSurveyUsecaseInterface
{
  constructor(
    @Inject('CustomerSurveyResponseRepositoryInterface')
    private customerSurveyResponseRepository: CustomerSurveyResponseRepositoryInterface,
  ) {}

  async postPostPurchaseSurvey({
    historyId,
    customerResponses,
  }: PostPostPurchaseSurveyDto): Promise<ReturnValueType<SurveyQuestionResponse[]>> {
    let productId:number;
    if(customerResponses && customerResponses.length){
      productId = customerResponses[0].productId;
    }
    const response = await this.customerSurveyResponseRepository
      .getCustomerSurveyOneProductResponses({ surveyHistoryId: historyId, productId });
    const surveyQuestionResponses = await Promise.all(customerResponses.map((customerResponse) => {
      return this.customerSurveyResponseRepository.upsertCustomerResponseWithProduct(
        {
          surveyHistoryId: historyId,
          surveyQuestionResponseId: response.find(({ surveyQuestionId }) =>
          { return surveyQuestionId === customerResponse.surveyQuestionId; })?.id,

          customerResponse: customerResponse.response,
          productId,
          surveyQuestionId: customerResponse.surveyQuestionId,
        }); }));

    return [surveyQuestionResponses];

  }
}

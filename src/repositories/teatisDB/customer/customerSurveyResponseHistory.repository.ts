import { Injectable } from '@nestjs/common';
import { CustomerSurveyHistory, Prisma, SurveyQuestionResponse } from '@prisma/client';

import { PrismaService } from '../../../prisma.service';

interface UpsertCustomerSurveyResponseHistoryArgs {
  surveyId: number;
  customerId: number;
  surveyResponses: TTemp[];
}

type TTemp = {
    surveyQuestionId: number;
    responseIds: number[];
};

export interface CustomerPrePurchaseSurveyHistoryRepositoryInterface {
  upsertCustomerSurveyResponseHistory({
    surveyId,
    customerId,
    surveyResponses,
  }: UpsertCustomerSurveyResponseHistoryArgs): Promise<[CustomerSurveyHistory & {
    surveyQuestionResponse: SurveyQuestionResponse[];
}, Error?]>;
}

@Injectable()
export class CustomerPrePurchaseSurveyHistoryRepository
implements CustomerPrePurchaseSurveyHistoryRepositoryInterface
{
  constructor(private prisma: PrismaService) {}
  async upsertCustomerSurveyResponseHistory({
    surveyId,
    customerId,
    surveyResponses,
  }: UpsertCustomerSurveyResponseHistoryArgs): Promise<[CustomerSurveyHistory & {
    surveyQuestionResponse: SurveyQuestionResponse[];
}, Error?]> {
    const CustomerSurveyHistoryIndentifier = { surveyId, customerId };
    const create = surveyResponses.map(surveyResponse => {
      return {
        surveyQuestionId: surveyResponse.surveyQuestionId,
        response: surveyResponse.responseIds as Prisma.JsonArray,
      };
    });
    const res = await this.prisma.customerSurveyHistory.upsert(
      {
        where: { CustomerSurveyHistoryIndentifier },
        create: {
          ...CustomerSurveyHistoryIndentifier,
          surveyQuestionResponse: { create },
        },
        update: {
          ...CustomerSurveyHistoryIndentifier,
          surveyQuestionResponse: { create },
        },
        include: { surveyQuestionResponse: true },
      }
    );
    return [res, null];
  }
}

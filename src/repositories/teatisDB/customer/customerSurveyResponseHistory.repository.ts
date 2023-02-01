import { Injectable } from '@nestjs/common';
// import { Prisma, ResponseType } from '@prisma/client';

import { PrismaService } from '../../../prisma.service';

interface UpsertCustomerSurveyResponseHistoryArgs {
  surveyId: number;
  customerId: number;
}

export interface CustomerPostPurchaseSurveyHistoryRepositoryInterface {
  upsertCustomerSurveyResponseHistory({
    surveyId,
    customerId,
  }: UpsertCustomerSurveyResponseHistoryArgs): Promise<[unknown, Error?]>;
}

@Injectable()
export class CustomerPostPurchaseSurveyHistoryRepository
implements CustomerPostPurchaseSurveyHistoryRepositoryInterface
{
  constructor(private prisma: PrismaService) {}
  async upsertCustomerSurveyResponseHistory({
    surveyId,
    customerId,
  }: UpsertCustomerSurveyResponseHistoryArgs): Promise<[unknown, Error?]> {
    const data = { surveyId, customerId };
    const res = await this.prisma.customerSurveyHistory.upsert(
      {
        where: { CustomerSurveyHistoryIndentifier: data },
        create: data,
        update: data,
      }
    );
    return [res, null];
  }
}

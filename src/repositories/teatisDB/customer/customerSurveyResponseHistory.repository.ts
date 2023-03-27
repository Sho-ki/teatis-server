
import { Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { CustomerSurveyHistoryAndResponses } from '../../../domains/CustomerSurveyHistoryAndResponses';

import { ReturnValueType } from '../../../filter/customError';

import { PrismaService } from '../../../prisma.service';
import { SurveyName } from '../../../usecases/utils/surveyName';
import { Transactionable } from '../../utils/transactionable.interface';

interface GetCustomerSurveyHistoryArgs {
  customerId: number;
  surveyName: SurveyName;
  orderNumber?:string;
}

interface CreateCustomerSurveyHistoryArgs {
  customerId: number;
  surveyName: SurveyName;
  orderNumber?:string;
}

export interface CustomerSurveyHistoryRepositoryInterface extends Transactionable{
  getCustomerSurveyHistory({
    customerId,
    surveyName,
    orderNumber,
  }: GetCustomerSurveyHistoryArgs): Promise<ReturnValueType<CustomerSurveyHistoryAndResponses>>;

  createCustomerSurveyHistory({
    customerId,
    surveyName,
    orderNumber,
  }: CreateCustomerSurveyHistoryArgs): Promise<CustomerSurveyHistoryAndResponses>;

}

@Injectable()
export class CustomerSurveyHistoryRepository
implements CustomerSurveyHistoryRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CustomerSurveyHistoryRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }

  async createCustomerSurveyHistory({
    customerId,
    surveyName,
    orderNumber,
  }: CreateCustomerSurveyHistoryArgs): Promise<CustomerSurveyHistoryAndResponses>{
    const response = await this.prisma.customerSurveyHistory.create(
      {
        data: {
          customer: { connect: { id: customerId } },
          survey: { connect: { name: surveyName } }, orderNumber,
        },
        include: { surveyQuestionResponse: true },
      },);

    return response;
  }

  async getCustomerSurveyHistory({
    customerId,
    surveyName,
    orderNumber = undefined,
  }: GetCustomerSurveyHistoryArgs): Promise<ReturnValueType<CustomerSurveyHistoryAndResponses>> {
    const response = await this.prisma.customerSurveyHistory.findFirst({
      where: { survey: { name: surveyName }, customerId, orderNumber },
      orderBy: { createdAt: 'desc' }, take: 1,
      include: { surveyQuestionResponse: true },
    });
    return [response];
  }

}

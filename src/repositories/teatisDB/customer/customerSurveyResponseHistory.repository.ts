
import { Injectable } from '@nestjs/common';
import { CustomerSurveyHistory } from '@prisma/client';

import { ReturnValueType } from '../../../filter/customError';

import { PrismaService } from '../../../prisma.service';
import { SurveyName } from '../../../usecases/utils/surveyName';

interface GetCustomerSurveyHistoryByOrderNumberArgs {
  customerId: number;
  surveyName: SurveyName;
  orderNumber:string;
}

interface CreateCustomerSurveyHistoryArgs {
  customerId: number;
  surveyName: SurveyName;
  orderNumber?:string;
}

export interface CustomerSurveyHistoryRepositoryInterface {
  getCustomerSurveyHistoryByOrderNumber({
    customerId,
    surveyName,
    orderNumber,
  }: GetCustomerSurveyHistoryByOrderNumberArgs): Promise<ReturnValueType<CustomerSurveyHistory>>;

  createCustomerSurveyHistory({
    customerId,
    surveyName,
    orderNumber,
  }: CreateCustomerSurveyHistoryArgs): Promise<CustomerSurveyHistory>;

}

@Injectable()
export class CustomerSurveyHistoryRepository
implements CustomerSurveyHistoryRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async createCustomerSurveyHistory({
    customerId,
    surveyName,
    orderNumber,
  }: CreateCustomerSurveyHistoryArgs): Promise<CustomerSurveyHistory>{
    const response = await this.prisma.customerSurveyHistory.create(
      { data: { customer: { connect: { id: customerId } }, survey: { connect: { name: surveyName } }, orderNumber } });

    return response;
  }

  async getCustomerSurveyHistoryByOrderNumber({
    customerId,
    surveyName,
    orderNumber,
  }: GetCustomerSurveyHistoryByOrderNumberArgs): Promise<ReturnValueType<CustomerSurveyHistory>> {
    const response = await this.prisma.customerSurveyHistory.findFirst({
      where: { survey: { name: surveyName }, customerId, orderNumber },
      orderBy: { createdAt: 'desc' }, take: 1,
    });

    if(!response){
      return [undefined, { name: 'NoSurveyHistory', message: 'The customer has no responses on this survey' }];
    }
    return [response];

  }

}

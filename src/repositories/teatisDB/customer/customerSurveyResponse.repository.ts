import { Injectable } from '@nestjs/common';
import { CustomerSurveyHistory } from '@prisma/client';
import { ProductSurveyQuestionResponse } from '../../../domains/PostPurchaseSurveyAnswer';
import { ReturnValueType } from '../../../filter/customError';

import { PrismaService } from '../../../prisma.service';
import { SURVEY_NAME } from '../../../usecases/utils/surveyName';

interface GetCustomerLatestSurveyHistoryArgs {
  customerId: number;
  surveyName: SURVEY_NAME;

}

interface CreateCustomerSurveyHistoryArgs {
  customerId: number;
  surveyName: SURVEY_NAME;
  orderNumber?:string;
}

interface GetAnswerCountArgs {
  customerId: number;
}

interface GetAnswerCountRes {
  currentMaxAnswerCount: number;
}

interface CheckIsNewSurveyAnswerArgs {
  orderNumber: string;
  currentMaxAnswerCount: number;
}

interface CheckIsNewSurveyAnswerRes {
  isNewSurveyAnswer: boolean;
}

interface GetCustomerProductSurveyResponseArgs {
  surveyHistoryId: number;
}

export interface CustomerSurveyResponseRepositoryInterface {
  getCustomerLatestSurveyHistory({
    customerId,
    surveyName,
  }: GetCustomerLatestSurveyHistoryArgs): Promise<ReturnValueType<CustomerSurveyHistory>>;

  createCustomerSurveyHistory({
    customerId,
    surveyName,
    orderNumber,
  }: CreateCustomerSurveyHistoryArgs): Promise<CustomerSurveyHistory>;

  getCustomerProductSurveyResponse({ surveyHistoryId }:GetCustomerProductSurveyResponseArgs):
  Promise<ProductSurveyQuestionResponse[]>;

  // postCustomerResponseWithProduct({
  //   customerId,
  //   orderNumber,
  //   surveyId,
  //   responses,
  // }: PostCustomerResponseWithProductsArgs): Promise<
  //   ReturnValueType<PostPurchaseSurveyAnswer>
  // >;

  getAnswerCount({ customerId }: GetAnswerCountArgs): Promise<[GetAnswerCountRes?, Error?]>;

  checkIsNewSurveyAnswer({
    orderNumber,
    currentMaxAnswerCount,
  }: CheckIsNewSurveyAnswerArgs): Promise<[CheckIsNewSurveyAnswerRes?, Error?]>;
}

@Injectable()
export class CustomerSurveyResponseRepository
implements CustomerSurveyResponseRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async getCustomerProductSurveyResponse({ surveyHistoryId }:GetCustomerProductSurveyResponseArgs):
  Promise<ProductSurveyQuestionResponse[]>{
    const response = await this.prisma.surveyQuestionResponse.findMany(
      {
        where: { customerSurveyHistoryId: surveyHistoryId },
        include: { intermediateProductSurveyQuestionResponse: { include: { product: true } } },
      });

    const returnValues:ProductSurveyQuestionResponse[] = response?.map((val) => {
      const matched = val.intermediateProductSurveyQuestionResponse.find((res) =>
      { return res.surveyQuestionResponseId === val.id; });

      const { id, externalSku, label, name } = matched.product;
      return { ...val, product: { id, label, name, sku: externalSku } };
    }) || [];
    return returnValues;

  }

  async createCustomerSurveyHistory({
    customerId,
    surveyName,
    orderNumber,
  }: CreateCustomerSurveyHistoryArgs): Promise<CustomerSurveyHistory>{
    const response = await this.prisma.customerSurveyHistory.create(
      { data: { customer: { connect: { id: customerId } }, survey: { connect: { name: surveyName } }, orderNumber } });

    return response;
  }

  async checkIsNewSurveyAnswer({
    orderNumber,
    currentMaxAnswerCount,
  }: CheckIsNewSurveyAnswerArgs): Promise<
    [CheckIsNewSurveyAnswerRes?, Error?]
  > {
    const count = await this.prisma.surveyQuestionAnswer.aggregate({
      where: { orderNumber, answerCount: currentMaxAnswerCount },
      _max: { answerCount: true },
    });
    return [{ isNewSurveyAnswer: count._max.answerCount !== currentMaxAnswerCount }];
  }

  async getAnswerCount({ customerId }: GetAnswerCountArgs): Promise<[GetAnswerCountRes?, Error?]> {
    const res = await this.prisma.surveyQuestionAnswer.aggregate({
      where: { customerId },
      _max: { answerCount: true },
    });
    const currentMaxAnswerCount = res?._max?.answerCount;

    return [{ currentMaxAnswerCount }];
  }

  async getCustomerLatestSurveyHistory({
    customerId,
    surveyName,
  }: GetCustomerLatestSurveyHistoryArgs): Promise<ReturnValueType<CustomerSurveyHistory>> {
    const response = await this.prisma.customerSurveyHistory.findFirst({
      where: { survey: { name: surveyName }, customerId },
      orderBy: { createdAt: 'desc' }, take: 1,
    });

    if(!response){
      return [undefined, { name: 'NoSurveyHistory', message: 'The customer has no responses on this survey' }];
    }
    return [response];

  }

  // async postCustomerResponseWithProduct({
  //   customerId,
  //   orderNumber,
  //   surveyId,
  //   responses,
  // }: PostCustomerResponseWithProductsArgs): Promise<
  //   ReturnValueType<PostPurchaseSurveyAnswer>
  // > {
  //   const response = await this.prisma.customerSurveyHistory.upsert(
  //     {
  //       where: { CustomerOrderSurveyHistoryIdentifier: { customerId, surveyId, orderNumber } },
  //       create: { customerId, surveyId, orderNumber },
  //       update: { customerId, surveyId, orderNumber },
  //     });

  // }
}

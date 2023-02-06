import { Injectable } from '@nestjs/common';
import { CustomerSurveyHistory, Prisma, SurveyQuestionResponse } from '@prisma/client';
import { ProductSurveyQuestionResponse } from '../../../domains/ProductSurveyQuestionResponse';

import { ReturnValueType } from '../../../filter/customError';

import { PrismaService } from '../../../prisma.service';
import { SURVEY_NAME } from '../../../usecases/utils/surveyName';

interface GetCustomerLatestSurveyHistoryArgs {
  customerId: number;
  surveyName: SURVEY_NAME;
  orderNumber:string;
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

interface GetCustomerSurveyOneProductResponsesArgs {
  surveyHistoryId:number;
  productId:number;
}

interface GetCustomerProductSurveyResponseArgs {
  surveyHistoryId: number;
}

interface UpsertCustomerResponseWithProductsArgs{
 surveyQuestionResponseId:number;
 surveyQuestionId:number;
 productId:number;
 customerResponse: unknown;
 surveyHistoryId:number;
}

export interface CustomerSurveyResponseRepositoryInterface {
  getCustomerLatestSurveyHistory({
    customerId,
    surveyName,
    orderNumber,
  }: GetCustomerLatestSurveyHistoryArgs): Promise<ReturnValueType<CustomerSurveyHistory>>;

  createCustomerSurveyHistory({
    customerId,
    surveyName,
    orderNumber,
  }: CreateCustomerSurveyHistoryArgs): Promise<CustomerSurveyHistory>;

  getCustomerSurveyAllProductsResponses({ surveyHistoryId }:GetCustomerProductSurveyResponseArgs):
  Promise<ProductSurveyQuestionResponse[]>;

  upsertCustomerResponseWithProduct({
    surveyQuestionResponseId,
    productId,
    customerResponse,
    surveyHistoryId,
    surveyQuestionId,
  }: UpsertCustomerResponseWithProductsArgs): Promise<SurveyQuestionResponse>;

  getAnswerCount({ customerId }: GetAnswerCountArgs): Promise<[GetAnswerCountRes?, Error?]>;

  getCustomerSurveyOneProductResponses(
    { surveyHistoryId, productId }: GetCustomerSurveyOneProductResponsesArgs):
    Promise<ProductSurveyQuestionResponse[]>;
}

@Injectable()
export class CustomerSurveyResponseRepository
implements CustomerSurveyResponseRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async getCustomerSurveyAllProductsResponses({ surveyHistoryId }:GetCustomerProductSurveyResponseArgs):
  Promise<ProductSurveyQuestionResponse[]>{
    const response = await this.prisma.surveyQuestionResponse.findMany(
      {
        where: { customerSurveyHistoryId: surveyHistoryId },
        include: {
          intermediateProductSurveyQuestionResponse:
          { include: { product: true } },
        },
      });

    const surveyQuestionResponses:ProductSurveyQuestionResponse[] = response?.map((val) => {
      const matched = val.intermediateProductSurveyQuestionResponse.find((res) =>
      { return res.surveyQuestionResponseId === val.id; });

      const { id, externalSku, label, name } = matched.product;
      return { ...val, product: { id, label, name, sku: externalSku } };
    }) || [];
    return surveyQuestionResponses;

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

  async getCustomerSurveyOneProductResponses({ surveyHistoryId, productId }: GetCustomerSurveyOneProductResponsesArgs):
   Promise<ProductSurveyQuestionResponse[]> {
    const response = await this.prisma.intermediateProductSurveyQuestionResponse.findMany({
      where: { surveyQuestionResponse: { customerSurveyHistoryId: surveyHistoryId }, productId },
      include: { surveyQuestionResponse: true, product: true },
    });

    if(!response.length){
      return [];
    }
    const surveyQuestionResponses:ProductSurveyQuestionResponse[] = response.map((val) => {

      const { id, externalSku, label, name } = val.product;
      return { ...val.surveyQuestionResponse, product: { id, label, name, sku: externalSku } };
    });
    return surveyQuestionResponses;
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
    orderNumber,
  }: GetCustomerLatestSurveyHistoryArgs): Promise<ReturnValueType<CustomerSurveyHistory>> {
    const response = await this.prisma.customerSurveyHistory.findFirst({
      where: { survey: { name: surveyName }, customerId, orderNumber },
      orderBy: { createdAt: 'desc' }, take: 1,
    });

    if(!response){
      return [undefined, { name: 'NoSurveyHistory', message: 'The customer has no responses on this survey' }];
    }
    return [response];

  }

  async upsertCustomerResponseWithProduct({
    surveyQuestionResponseId,
    productId,
    customerResponse,
    surveyHistoryId,
    surveyQuestionId,
  }: UpsertCustomerResponseWithProductsArgs): Promise<SurveyQuestionResponse> {
    if(!surveyQuestionResponseId){
      return await this.prisma.surveyQuestionResponse.create(
        {
          data:
         {
           response: customerResponse? JSON.stringify(customerResponse):Prisma.DbNull,
           surveyQuestion: { connect: { id: surveyQuestionId } },
           customerSurveyHistory: { connect: { id: surveyHistoryId } },
           intermediateProductSurveyQuestionResponse: { create: { productId } },
         },
        });
    }
    return  await this.prisma.surveyQuestionResponse.update(
      {
        where: { id: surveyQuestionResponseId },
        data: { response: customerResponse? JSON.stringify(customerResponse):Prisma.DbNull },
      });

  }
}

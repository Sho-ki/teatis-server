import { Injectable } from '@nestjs/common';
import { CustomerSurveyHistory, Prisma, SurveyQuestionResponse } from '@prisma/client';
import { ProductSurveyQuestionResponse } from '../../../domains/ProductSurveyQuestionResponse';

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

  getCustomerSurveyAllProductsResponses({ surveyHistoryId }:GetCustomerProductSurveyResponseArgs):
  Promise<ProductSurveyQuestionResponse[]>;

  upsertCustomerResponseWithProduct({
    surveyQuestionResponseId,
    productId,
    customerResponse,
    surveyHistoryId,
    surveyQuestionId,
  }: UpsertCustomerResponseWithProductsArgs): Promise<SurveyQuestionResponse>;

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

    const surveyQuestionResponses:ProductSurveyQuestionResponse[] = response?.map((res) => {
      const matched = res.intermediateProductSurveyQuestionResponse.find((responseProductSet) =>
      { return responseProductSet.surveyQuestionResponseId === res.id; });

      const { id, externalSku, label, name } = matched.product;
      return { ...res, product: { id, label, name, sku: externalSku } };
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

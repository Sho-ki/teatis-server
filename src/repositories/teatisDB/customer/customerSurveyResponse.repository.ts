import { Inject, Injectable } from '@nestjs/common';
import {  Prisma, PrismaClient, SurveyQuestionResponse  } from '@prisma/client';
import { ProductSurveyQuestionResponse } from '@Domains/ProductSurveyQuestionResponse';

import { PrismaService } from '../../../prisma.service';
import { Transactionable } from '../../utils/transactionable.interface';
import { SurveyName } from '../../../usecases/utils/surveyName';
import { SurveyQuestionResponsesWithSurveyQuestionOptions } from '../../../domains/SurveyQuestionResponse';
import { ReturnValueType } from '../../../filter/customError';

interface UpsertCustomerResponseArgs {
  surveyHistoryId:number;
  surveyQuestionId: number;
  customerResponse: Prisma.JsonValue;
  surveyQuestionResponseId?:number;
}

interface UpsertCustomerResponseWithProductsArgs{
 surveyQuestionResponseId?:number;
 surveyQuestionId:number;
 productId:number;
 customerResponse: Prisma.JsonValue;
 surveyHistoryId:number;
}

interface GetCustomerSurveyOneProductResponsesArgs {
  surveyHistoryId:number;
  productId:number;
}

interface GetCustomerProductSurveyResponseArgs {
  surveyHistoryId: number;
}

interface GetCustomerSurveyResponsesArgs {
  surveyName: SurveyName;
  customerId: number;
}

export interface CustomerSurveyResponseRepositoryInterface extends Transactionable {

  upsertCustomerResponse({
    surveyHistoryId,
    surveyQuestionId,
    customerResponse,
    surveyQuestionResponseId,
  }: UpsertCustomerResponseArgs): Promise<SurveyQuestionResponse>;

  upsertCustomerResponseWithProduct({
    surveyQuestionResponseId,
    productId,
    customerResponse,
    surveyHistoryId,
    surveyQuestionId,
  }: UpsertCustomerResponseWithProductsArgs): Promise<SurveyQuestionResponse>;

  getCustomerSurveyAllProductsResponses({ surveyHistoryId }:GetCustomerProductSurveyResponseArgs):
  Promise<ProductSurveyQuestionResponse[]>;

  getCustomerSurveyOneProductResponses(
    { surveyHistoryId, productId }: GetCustomerSurveyOneProductResponsesArgs):
    Promise<ProductSurveyQuestionResponse[]>;

  getCustomerSurveyResponsesWithSurveyQuestionOptions(
    { surveyName, customerId }: GetCustomerSurveyResponsesArgs):
    Promise<ReturnValueType<SurveyQuestionResponsesWithSurveyQuestionOptions[]>>;

}

@Injectable()
export class CustomerSurveyResponseRepository
implements CustomerSurveyResponseRepositoryInterface
{
  private originalPrismaClient : PrismaClient;
  constructor(@Inject(PrismaService) private prisma: PrismaClient | Prisma.TransactionClient) {}
  setPrismaClient(prisma: Prisma.TransactionClient): CustomerSurveyResponseRepositoryInterface {
    this.originalPrismaClient = this.prisma as PrismaClient;
    this.prisma = prisma;
    return this;
  }

  setDefaultPrismaClient() {
    this.prisma = this.originalPrismaClient;
  }
  async upsertCustomerResponse({
    surveyHistoryId,
    surveyQuestionId,
    customerResponse,
    surveyQuestionResponseId,
  }: UpsertCustomerResponseArgs): Promise<SurveyQuestionResponse> {

    if(!surveyQuestionResponseId){
      return await this.prisma.surveyQuestionResponse.create(
        {
          data:
         {
           response: customerResponse? customerResponse:Prisma.DbNull,
           surveyQuestion: { connect: { id: surveyQuestionId } },
           customerSurveyHistory: { connect: { id: surveyHistoryId } },
         },
        });
    }
    return await this.prisma.surveyQuestionResponse.update(
      {
        where: { id: surveyQuestionResponseId },
        data: { response: customerResponse? customerResponse:Prisma.DbNull },
      });
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
           response: customerResponse? customerResponse:Prisma.DbNull,
           surveyQuestion: { connect: { id: surveyQuestionId } },
           customerSurveyHistory: { connect: { id: surveyHistoryId } },
           intermediateProductSurveyQuestionResponse: { create: { productId } },
         },
        });
    }
    return  await this.prisma.surveyQuestionResponse.update(
      {
        where: { id: surveyQuestionResponseId },
        data: { response: customerResponse? customerResponse:Prisma.DbNull },
      });

  }

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

  async getCustomerSurveyResponsesWithSurveyQuestionOptions(
    { surveyName, customerId  }: GetCustomerSurveyResponsesArgs):
    Promise<ReturnValueType<SurveyQuestionResponsesWithSurveyQuestionOptions[]>>{
    const response = await this.prisma.surveyQuestionResponse.findMany({
      where: { customerSurveyHistory: { survey: { name: surveyName }, customerId } },
      include: { surveyQuestion: { include: { surveyQuestionOptions: true } } },
    });
    return [response];
  }
}

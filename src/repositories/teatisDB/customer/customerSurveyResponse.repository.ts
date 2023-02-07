import { Injectable } from '@nestjs/common';
import {  Prisma, SurveyQuestionResponse  } from '@prisma/client';
import { ProductSurveyQuestionResponse } from '@Domains/ProductSurveyQuestionResponse';

import { PrismaService } from '../../../prisma.service';

interface UpsertCustomerResponseArgs {
  surveyHistoryId:number;
  surveyQuestionId: number;
  customerResponse: unknown;
  surveyQuestionResponseId?:number;
}

interface UpsertCustomerResponseWithProductsArgs{
 surveyQuestionResponseId?:number;
 surveyQuestionId:number;
 productId:number;
 customerResponse: unknown;
 surveyHistoryId:number;
}

interface GetCustomerSurveyOneProductResponsesArgs {
  surveyHistoryId:number;
  productId:number;
}

interface GetCustomerProductSurveyResponseArgs {
  surveyHistoryId: number;
}

export interface CustomerSurveyResponseRepositoryInterface {
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
}

@Injectable()
export class CustomerSurveyResponseRepository
implements CustomerSurveyResponseRepositoryInterface
{
  constructor(private prisma: PrismaService) {}
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
           response: customerResponse? JSON.stringify(customerResponse):Prisma.DbNull,
           surveyQuestion: { connect: { id: surveyQuestionId } },
           customerSurveyHistory: { connect: { id: surveyHistoryId } },
         },
        });
    }
    return await this.prisma.surveyQuestionResponse.update(
      {
        where: { id: surveyQuestionResponseId },
        data: { response: customerResponse? JSON.stringify(customerResponse):Prisma.DbNull },
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
}

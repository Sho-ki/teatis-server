import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';
import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { ReturnValueType } from '@Filters/customError';
import { SurveyQuestionsRepositoryInterface } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import {  ParentSurveyQuestion } from '@Domains/Survey';
import { PostPurchaseSurveyWithResponse } from '@Domains/PostPurchaseSurvey';
import { SurveyName } from '../utils/surveyName';
import { CustomerSurveyResponseRepositoryInterface } from '@Repositories/teatisDB/customer/customerSurveyResponse.repository';
import { CustomerSurveyHistoryRepositoryInterface } from '@Repositories/teatisDB/customer/customerSurveyResponseHistory.repository';

interface GetPostPurchaseSurveyUsecaseArgs {
  uuid: string;
}

export interface GetPostPurchaseSurveyUsecaseInterface {
  getPostPurchaseSurvey({ uuid }: GetPostPurchaseSurveyUsecaseArgs):
  Promise<ReturnValueType<PostPurchaseSurveyWithResponse>>;
}

@Injectable()
export class GetPostPurchaseSurveyUsecase
implements GetPostPurchaseSurveyUsecaseInterface
{
  constructor(
    @Inject('ShipheroRepositoryInterface')
    private shipheroRepository: ShipheroRepositoryInterface,
    @Inject('SurveyQuestionsRepositoryInterface')
    private surveyQuestionsRepository: SurveyQuestionsRepositoryInterface,
    @Inject('ProductGeneralRepositoryInterface')
    private productGeneralRepository: ProductGeneralRepositoryInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerSurveyResponseRepositoryInterface')
    private customerSurveyResponseRepository: CustomerSurveyResponseRepositoryInterface,
    @Inject('CustomerSurveyHistoryRepositoryInterface')
    private customerSurveyHistoryRepository: CustomerSurveyHistoryRepositoryInterface,

  ) {}

  async getPostPurchaseSurvey({ uuid }:
    GetPostPurchaseSurveyUsecaseArgs): Promise<ReturnValueType<PostPurchaseSurveyWithResponse>> {
    // Get last order products from shiphero
    const [customer, getCustomerError] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    if(getCustomerError){
      return [undefined, getCustomerError];
    }

    const [customerOrder, getOrderError] =
    await this.shipheroRepository.getLastCustomerOrder({ email: customer.email, uuid });
    if (getOrderError) {
      return [undefined, getOrderError];
    }

    const [dbProducts, getDdbProductsError] =
      await this.productGeneralRepository.getProductsBySku({ products: customerOrder.products });
    if (getDdbProductsError) {
      return [undefined, getDdbProductsError];
    }
    const orderProducts = dbProducts.filter((product) => {
      return customerOrder.products.findIndex(({ sku }) => { return sku === product.sku; }) > -1;
    });
    const [survey, getSurveyError] =
      await this.surveyQuestionsRepository.getSurveyQuestions({ surveyName: SurveyName.PostPurchase });

    if (getSurveyError) {
      return [undefined, getSurveyError];
    }

    const filledSurveyQuestions: ParentSurveyQuestion[] = [];

    survey.surveyQuestions.forEach(parentQuestion => {
      const containsProduct = parentQuestion.label.includes('${PRODUCT_NAME}');
      if (containsProduct) {
        for (let i = 0; i < orderProducts.length; i++) {
          const newParentQuestion:ParentSurveyQuestion = JSON.parse(JSON.stringify(parentQuestion));
          newParentQuestion.label = newParentQuestion.label.replace(
            '${PRODUCT_NAME}',
            orderProducts[i].label,
          );
          newParentQuestion.product= orderProducts[i];

          const childQuestions = newParentQuestion.children;
          for(const childQuestion of childQuestions){
            childQuestion.label = childQuestion.label.replace(
              '${PRODUCT_NAME}',
              orderProducts[i].label,
            );

          }
          filledSurveyQuestions.push(newParentQuestion);
        }
      } else {
        filledSurveyQuestions.push(parentQuestion);

      }
    });
    let [customerSurveyHistory] =
      await this.customerSurveyHistoryRepository.getCustomerSurveyHistory({
        customerId: customer.id,
        surveyName: SurveyName.PostPurchase,
        orderNumber: customerOrder.orderNumber,
      });
    if (!customerSurveyHistory) {
      customerSurveyHistory = await this.customerSurveyHistoryRepository.createCustomerSurveyHistory(
        { customerId: customer.id, surveyName: SurveyName.PostPurchase, orderNumber: customerOrder.orderNumber });
    }

    const customerResponses =
    await this.customerSurveyResponseRepository.getCustomerSurveyAllProductsResponses(
      { surveyHistoryId: customerSurveyHistory.id });

    for(const questions of filledSurveyQuestions){
      for(const customerResponse of customerResponses){
        const hasResponse = questions.id ===customerResponse.surveyQuestionId
              && questions.product.id === customerResponse.product.id;
        if(hasResponse){
          questions.customerResponse = customerResponse.response as string | number | number[];
        }

        for(const childQuestion of questions.children){
          const hasResponse = childQuestion.id === customerResponse.surveyQuestionId
              && questions.product.id === customerResponse.product.id;
          if(hasResponse){
            childQuestion.customerResponse = customerResponse.response as string | number | number[];
          }
        }
      }
    }
    survey.surveyQuestions = filledSurveyQuestions;
    return [{ ...survey, redirectEndpoint: '/teatis-meal-box', historyId: customerSurveyHistory.id }];

  }
}


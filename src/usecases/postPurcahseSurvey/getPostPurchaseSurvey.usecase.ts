import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';
import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import { QuestionPostPurchaseSurveyRepositoryInterface } from '@Repositories/teatisDB/question/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepositoryInterface } from '@Repositories/teatisDB/customer/customerPostPurchaseSurvey.repository';
import {
  PostPurchaseSurvey,
  SurveyQuestions,
} from 'src/domains/PostPurchaseSurvey';
import { DisplayProduct } from '@Domains/Product';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { ReturnValueType } from '@Filters/customError';
import { PRACTITIONER_BOX_PLANS } from '../utils/practitionerBoxPlan';

interface GetPostPurchaseSurveyUsecaseArgs {
  uuid: string;
  orderNumber?: string;
}

export interface GetPostPurchaseSurveyUsecaseInterface {
  getPostPurchaseSurvey({
    uuid,
    orderNumber,
  }: GetPostPurchaseSurveyUsecaseArgs): Promise<ReturnValueType<PostPurchaseSurvey>>;
}

@Injectable()
export class GetPostPurchaseSurveyUsecase
implements GetPostPurchaseSurveyUsecaseInterface
{
  constructor(
    @Inject('ShipheroRepositoryInterface')
    private shipheroRepository: ShipheroRepositoryInterface,
    @Inject('QuestionPostPurchaseSurveyRepositoryInterface')
    private questionPostPurchaseSurveyRepository: QuestionPostPurchaseSurveyRepositoryInterface,
    @Inject('CustomerPostPurchaseSurveyRepositoryInterface')
    private customerPostPurchaseSurveyRepository: CustomerPostPurchaseSurveyRepositoryInterface,
    @Inject('ProductGeneralRepositoryInterface')
    private productGeneralRepository: ProductGeneralRepositoryInterface,
     @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async getPostPurchaseSurvey({
    uuid,
    orderNumber,
  }: GetPostPurchaseSurveyUsecaseArgs): Promise<ReturnValueType<PostPurchaseSurvey>> {
    // Get last order products from shiphero
    const [customer, getCustomerError] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    if(getCustomerError){
      return [undefined, getCustomerError];
    }

    const [customerOrder, getOrderError] = orderNumber
      ? await this.shipheroRepository.getCustomerOrderByOrderNumber({ orderNumber })
      : await this.shipheroRepository.getLastCustomerOrder({ email: customer.email });

    if (getOrderError) {
      return [undefined, getOrderError];
    }
    const [displayProducts, getProductDetailError] =
      await this.productGeneralRepository.getProductsBySku({ products: customerOrder.products });

    if (getProductDetailError) {
      return [undefined, getProductDetailError];
    }
    const detailedProductList: Pick<
      DisplayProduct,
      'id' | 'sku' | 'label' | 'images' | 'vendor'
    >[] = customerOrder.products.map((orderProduct) => {
      let detailedProduct: Pick<
        DisplayProduct,
        'id' | 'sku' | 'label' | 'images' | 'vendor'
      >;
      displayProducts.map((product) => {
        if (!product.vendor) {
          product.vendor = 'Teatis Meal';
        }
        if (orderProduct.sku === product.sku) {
          detailedProduct = {
            id: product.id,
            sku: product.sku,
            label: product.label,
            images: product.images,
            vendor: product.vendor,
          };
        }
      });
      return detailedProduct;
    });

    const [surveyQuestion, getPostPurchaseQuestionsError] =
      await this.questionPostPurchaseSurveyRepository.getSurveyQuestions({ surveyName: 'post-purchase' });
    if (getPostPurchaseQuestionsError) {
      return [undefined, getPostPurchaseQuestionsError];
    }

    const [customerAnswer, getCustomerAnswersError] =
      await this.customerPostPurchaseSurveyRepository.getCustomerAnswers({
        email: customer.email,
        orderNumber: customerOrder.orderNumber,
      });
    if (getCustomerAnswersError) {
      return [undefined, getCustomerAnswersError];
    }

    const personalizedPostPurchaseSurveyQuestions: PostPurchaseSurvey = {
      orderNumber: customerOrder.orderNumber,
      customerId: customerAnswer.id,
      surveyQuestions: [],
      redirectEndpoint: customerOrder.products.find(({ sku }) => sku===PRACTITIONER_BOX_PLANS.sku)
        ? '/teatis-meal-box'
        : `/teatis-meal-box/next-box?uuid=${customer.uuid}`,
    };
    surveyQuestion.surveyQuestions.map((question) => {
      const personalizedQuestion:SurveyQuestions = {
        ...question,
        answer: {
          text: undefined,
          numeric: undefined,
          singleOption: undefined,
          multipleOptions: undefined,
          bool: undefined,
        },
        responseId: undefined,
        instruction: undefined,
        placeholder: undefined,
        reason: undefined,
        title: undefined,
        content: undefined,
      };

      if (question.label.includes('${PRODUCT_NAME}')) {
        for (const product of detailedProductList) {
          if (!product) continue;
          const replacedLabel = question.label.replace(
            '${PRODUCT_NAME}',
            product.label,
          );
          const images = [];
          if (product.images.length > 0) {
            for (const image of product.images) {
              images.push({
                src: image.src,
                position: image.position,
                alt: product.label,
              });
            }
          }
          personalizedQuestion.responseId = uuidv4();
          const deepCopy = JSON.parse(JSON.stringify(personalizedQuestion));
          personalizedPostPurchaseSurveyQuestions.surveyQuestions.push({
            ...deepCopy,

            label: replacedLabel,
            product: {
              id: product.id,
              sku: product.sku,
              label: product.label,
              vendor: product.vendor,
              images,
            },
          });
        }
      } else {
        if (personalizedQuestion.name !== 'productLineUp') {
          personalizedQuestion.responseId = uuidv4();
          personalizedPostPurchaseSurveyQuestions.surveyQuestions.push(
            personalizedQuestion,
          );
        }
      }
    });
    for (const question of personalizedPostPurchaseSurveyQuestions.surveyQuestions) {
      for (const customerAns of customerAnswer.customerAnswers) {
        if (question?.name === 'productLineUp') continue;
        if (customerAns.productId === question?.product?.id) {
          question.reason = customerAns?.reason
            ? customerAns.reason
            : undefined;

          question.responseId = customerAns.responseId;

          if (customerAns.surveyQuestionId === question.id) {
            switch (question.answerType) {
              case 'boolean':
                question.answer.bool = customerAns.answer.bool;
                break;
              case 'numeric':
                question.answer.numeric = customerAns.answer.numeric;
                break;
              case 'text':
                question.answer.text = customerAns.answer.text;
                break;
              case 'singleAnswer':
                question.answer.singleOption = {
                  id: customerAns.answer.singleOptionId,
                  name: question.options.find((option) => {
                    return option.id === customerAns.answer.singleOptionId;
                  }).name,
                  label: question.options.find((option) => {
                    return option.id === customerAns.answer.singleOptionId;
                  }).label,
                };
                break;
              case 'multipleAnswer':
                question.answer.multipleOptions =
                  question.answer.multipleOptions.filter((option) => {
                    return customerAns.answer.multipleOptionIds.includes(
                      option.id,
                    );
                  });
                break;
              default:
                break;
            }
          }
        }
      }
    }

    return [personalizedPostPurchaseSurveyQuestions, undefined];
  }
}

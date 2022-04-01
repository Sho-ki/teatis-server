import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { ShipheroRepoInterface } from 'src/repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from 'src/repositories/teatisDB/productRepo/productGeneral.repository';
import { QuestionPostPurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/questionRepo/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import {
  PostPurchaseSurvey,
  SurveyQuestions,
} from 'src/domains/PostPurchaseSurvey';
import { Product } from '../../domains/Product';

interface GetPostPurchaseSurveyUsecaseArgs {
  email: string;
  orderNumber?: string;
}

export interface GetPostPurchaseSurveyUsecaseInterface {
  getPostPurchaseSurvey({
    email,
    orderNumber,
  }: GetPostPurchaseSurveyUsecaseArgs): Promise<[PostPurchaseSurvey, Error]>;
}

@Injectable()
export class GetPostPurchaseSurveyUsecase
  implements GetPostPurchaseSurveyUsecaseInterface
{
  constructor(
    @Inject('ShipheroRepoInterface')
    private shipheroRepo: ShipheroRepoInterface,
    @Inject('QuestionPostPurchaseSurveyRepoInterface')
    private questionPostPurchaseSurveyRepo: QuestionPostPurchaseSurveyRepoInterface,
    @Inject('CustomerPostPurchaseSurveyRepoInterface')
    private customerPostPurchaseSurveyRepo: CustomerPostPurchaseSurveyRepoInterface,
    @Inject('ProductGeneralRepoInterface')
    private productGeneralRepo: ProductGeneralRepoInterface,
  ) {}

  async getPostPurchaseSurvey({
    email,
    orderNumber,
  }: GetPostPurchaseSurveyUsecaseArgs): Promise<[PostPurchaseSurvey, Error]> {
    // Get last order products from shiphero

    const [getOrderRes, getOrderError] = orderNumber
      ? await this.shipheroRepo.getOrderByOrderNumber({ orderNumber })
      : await this.shipheroRepo.getLastOrder({ email });

    if (getOrderError) {
      return [null, getOrderError];
    }
    const [getProductDetailRes, getProductDetailError] =
      await this.productGeneralRepo.getProductsBySku({
        products: getOrderRes.products,
      });

    if (getProductDetailError) {
      return [null, getProductDetailError];
    }
    let detailedProductList: Pick<
      Product,
      'id' | 'sku' | 'label' | 'images' | 'vendor'
    >[] = getOrderRes.products.map((orderProduct) => {
      let detailedProduct: Pick<
        Product,
        'id' | 'sku' | 'label' | 'images' | 'vendor'
      >;
      getProductDetailRes.products.map(async (product) => {
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

    const [getPostPurchaseQuestionsRes, getPostPurchaseQuestionsError] =
      await this.questionPostPurchaseSurveyRepo.getSurveyQuestions({
        surveyName: 'post-purchase',
      });
    if (getPostPurchaseQuestionsError) {
      return [null, getPostPurchaseQuestionsError];
    }

    const [getCustomerAnswersRes, getCustomerAnswersError] =
      await this.customerPostPurchaseSurveyRepo.getCustomerAnswers({
        email,
        orderNumber: getOrderRes.orderNumber,
      });
    if (getCustomerAnswersError) {
      return [null, getCustomerAnswersError];
    }

    let personalizedPostPurchaseSurveyQuestions: PostPurchaseSurvey = {
      orderNumber: getOrderRes.orderNumber,
      customerId: getCustomerAnswersRes.id,
      surveyQuestions: [],
    };
    getPostPurchaseQuestionsRes.surveyQuestions.map((question) => {
      let personalizedQuestion: SurveyQuestions;
      personalizedQuestion = {
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
        for (let product of detailedProductList) {
          if (!product) continue;
          const replacedLabel = question.label.replace(
            '${PRODUCT_NAME}',
            product.label,
          );
          let images = [];
          if (product.images.length > 0) {
            for (let image of product.images) {
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
        personalizedQuestion.responseId = uuidv4();
        personalizedPostPurchaseSurveyQuestions.surveyQuestions.push(
          personalizedQuestion,
        );
      }
    });
    for (let question of personalizedPostPurchaseSurveyQuestions.surveyQuestions) {
      for (let customerAnswer of getCustomerAnswersRes.customerAnswers) {
        if (
          question?.name === 'productLineUp' &&
          customerAnswer?.answer?.text !== null
        ) {
          question.answer.text = customerAnswer.answer.text;
          question.responseId = customerAnswer.responseId;
          break;
        }
        if (customerAnswer.productId === question?.product?.id) {
          question.reason = customerAnswer?.reason
            ? customerAnswer.reason
            : undefined;

          question.responseId = customerAnswer.responseId;

          if (customerAnswer.surveyQuestionId === question.id) {
            switch (question.answerType) {
              case 'boolean':
                question.answer.bool = customerAnswer.answer.bool;
                break;
              case 'numeric':
                question.answer.numeric = customerAnswer.answer.numeric;
                break;
              case 'text':
                question.answer.text = customerAnswer.answer.text;
                break;
              case 'singleAnswer':
                question.answer.singleOption = {
                  id: customerAnswer.answer.singleOptionId,
                  name: question.options.find((option) => {
                    return option.id === customerAnswer.answer.singleOptionId;
                  }).name,
                  label: question.options.find((option) => {
                    return option.id === customerAnswer.answer.singleOptionId;
                  }).label,
                };
                break;
              case 'multipleAnswer':
                question.answer.multipleOptions =
                  question.answer.multipleOptions.filter((option) => {
                    return customerAnswer.answer.multipleOptionIds.includes(
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

    return [personalizedPostPurchaseSurveyQuestions, null];
  }
}

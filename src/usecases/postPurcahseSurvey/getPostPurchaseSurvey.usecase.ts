import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { ShipheroRepoInterface } from '@Repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from '@Repositories/teatisDB/productRepo/productGeneral.repository';
import { QuestionPostPurchaseSurveyRepoInterface } from '@Repositories/teatisDB/questionRepo/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepoInterface } from '@Repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import {
  PostPurchaseSurvey,
  SurveyQuestions,
} from 'src/domains/PostPurchaseSurvey';
import { DisplayProduct, Product } from '@Domains/Product';

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

    const [customerOrder, getOrderError] = orderNumber
      ? await this.shipheroRepo.getCustomerOrderByOrderNumber({ orderNumber })
      : await this.shipheroRepo.getLastCustomerOrder({ email });

    if (getOrderError) {
      return [null, getOrderError];
    }
    const [displayProducts, getProductDetailError] =
      await this.productGeneralRepo.getProductsBySku({
        products: customerOrder.products,
      });

    if (getProductDetailError) {
      return [null, getProductDetailError];
    }
    let detailedProductList: Pick<
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
      await this.questionPostPurchaseSurveyRepo.getSurveyQuestions({
        surveyName: 'post-purchase',
      });
    if (getPostPurchaseQuestionsError) {
      return [null, getPostPurchaseQuestionsError];
    }

    const [customerAnswer, getCustomerAnswersError] =
      await this.customerPostPurchaseSurveyRepo.getCustomerAnswers({
        email,
        orderNumber: customerOrder.orderNumber,
      });
    if (getCustomerAnswersError) {
      return [null, getCustomerAnswersError];
    }

    let personalizedPostPurchaseSurveyQuestions: PostPurchaseSurvey = {
      orderNumber: customerOrder.orderNumber,
      customerId: customerAnswer.id,
      surveyQuestions: [],
    };
    surveyQuestion.surveyQuestions.map((question) => {
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
      for (let customerAns of customerAnswer.customerAnswers) {
        if (
          question?.name === 'productLineUp' &&
          customerAns?.answer?.text !== null
        ) {
          question.answer.text = customerAns.answer.text;
          question.responseId = customerAns.responseId;
          break;
        }
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

    return [personalizedPostPurchaseSurveyQuestions, null];
  }
}

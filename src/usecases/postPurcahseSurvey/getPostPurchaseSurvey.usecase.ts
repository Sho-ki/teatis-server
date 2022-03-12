import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from 'src/repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from 'src/repositories/teatisDB/productRepo/productGeneral.repository';
import { QuestionPostPurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/questionRepo/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import { PostPurchaseSurvey } from 'src/domains/PostPurchaseSurvey';

interface GetPostPurchaseSurveyUsecaseArgs {
  email: string;
  orderNumber?: string;
}

interface GetPostPurchaseSurveyProduct {
  shopifyId?: number;
  shipheroId?: string;
  dbProductId?: number;
  label: string;
  sku: string;
  vendor: string;
  images: GetPostPurchaseSurveyImage[];
}

export interface GetPostPurchaseSurveyImage {
  position: number;
  alt?: string | null;
  src: string;
}

export interface GetPostPurchaseSurveyUsecaseInterface {
  getPostPurchaseSurvey({
    email,
    orderNumber,
  }: GetPostPurchaseSurveyUsecaseArgs): Promise<[PostPurchaseSurvey[], Error]>;
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
  }: GetPostPurchaseSurveyUsecaseArgs): Promise<[PostPurchaseSurvey[], Error]> {
    // Get last order products from shiphero

    const [order, getOrderError] = orderNumber
      ? await this.shipheroRepo.getOrderByOrderNumber({ orderNumber })
      : await this.shipheroRepo.getLastOrder({ email });

    if (getOrderError) {
      return [null, getOrderError];
    }
    const [productDetail, getProductDetailError] =
      await this.productGeneralRepo.getProducts({ products: order.products });

    if (getProductDetailError) {
      return [null, getProductDetailError];
    }
    let detailedProductList: GetPostPurchaseSurveyProduct[] =
      order.products.map((orderProduct) => {
        let detailedProduct: GetPostPurchaseSurveyProduct;
        productDetail.products.map(async (product) => {
          if (!product.vendor) {
            product.vendor = 'Teatis Meals';
          }
          if (orderProduct.sku === product.sku) {
            detailedProduct = {
              dbProductId: product.id,
              sku: product.sku,
              label: product.label,
              images: product.images,
              vendor: product.vendor,
            };
          }
        });
        return detailedProduct;
      });

    const [postPurchaseSurveyQuestions, getpostPurchaseSurveyQuestionsError] =
      await this.questionPostPurchaseSurveyRepo.getSurveyQuestions({
        surveyName: 'post-purchase',
      });
    if (getpostPurchaseSurveyQuestionsError) {
      return [null, getpostPurchaseSurveyQuestionsError];
    }

    const [customerWithAnswers, getCustomerWithAnswersError] =
      await this.customerPostPurchaseSurveyRepo.getCustomerWithAnswers({
        email,
        orderNumber: order.orderNumber,
      });
    if (getCustomerWithAnswersError) {
      return [null, getpostPurchaseSurveyQuestionsError];
    }

    let personalizedPostPurchaseSurveyQuestions: PostPurchaseSurvey[] = [];
    postPurchaseSurveyQuestions.surveyQuestions.map((question) => {
      let personalizedQuestion: PostPurchaseSurvey;
      personalizedQuestion = {
        ...question,
        shopifyOrderNumber: order.orderNumber,
        customerId: customerWithAnswers.id,
        answer: {
          text: undefined,
          numeric: undefined,
          singleOption: undefined,
          multipleOptions: undefined,
          bool: undefined,
        },
        reason: undefined,
        title: undefined,
        content: undefined,
      };

      if (question.label.includes('${PRODUCT_NAME}')) {
        for (let product of detailedProductList) {
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
          const deepCopy = JSON.parse(JSON.stringify(personalizedQuestion));
          personalizedPostPurchaseSurveyQuestions.push({
            ...deepCopy,
            label: replacedLabel,
            product: {
              id: product.dbProductId,
              label: product.label,
              vendor: product.vendor,
              images,
            },
          });
        }
      } else {
        personalizedPostPurchaseSurveyQuestions.push(personalizedQuestion);
      }
    });

    for (let customerAnswer of customerWithAnswers.customerAnswers) {
      personalizedPostPurchaseSurveyQuestions.find((question) => {
        if (customerAnswer.productId === question.product.id) {
          if (customerAnswer.reason) {
            question.reason = customerAnswer.reason;
          }
          if (customerAnswer.title) {
            question.title = customerAnswer.title;
          }
          if (customerAnswer.content) {
            question.content = customerAnswer.content;
          }
          if (customerAnswer.surveyQuestionId === question.id) {
            switch (question.surveyQuestionAnswerType.name) {
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
                  name: question.surveyQuestionOptions.find((option) => {
                    return option.id === customerAnswer.answer.singleOptionId;
                  }).name,
                  label: question.surveyQuestionOptions.find((option) => {
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
      });
    }

    return [personalizedPostPurchaseSurveyQuestions, null];
  }
}

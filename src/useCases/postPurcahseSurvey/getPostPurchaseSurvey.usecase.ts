import { Inject, Injectable } from '@nestjs/common';

import {
  GetLastOrderRes as ShipheroGetLastOrderRes,
  GetProductDetailRes as ShipheroGetProductDetailRes,
  GetVendorsRes as ShipherpGetVendorsRes,
  ShipheroRepoInterface,
} from '../../repositories/shiphero/shiphero.repository';
import {
  ProductPostPurchaseSurveyRepoInterface,
  UpsertProductRes as TeatisDBUpsertProductRes,
} from '../../repositories/teatisDB/productRepo/productPostPurchaseSurvey.repository';
import {
  GetSurveyIdRes as TeatisDBGetSurveyIdRes,
  GetSurveyQuestionsRes as TeatisDBGetSurveyQuestionsRes,
  QuestionPostPurchaseSurveyRepoInterface,
} from '../../repositories/teatisDB/questionRepo/questionPostPurchaseSurvey.repository';
import {
  CustomerPostPurchaseSurveyRepoInterface,
  GetCustomerProductFeedbackAnswersRes as TeatisDBGetCustomerProductFeedbackAnswersRes,
  GetCustomerRes as TeatisDBGetCustomerRes,
} from '../../repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import {
  GetPostPurchaseSurveyUsecaseArgs,
  GetPostPurchaseSurveyUsecaseRes,
} from '../../domains/postPurchaseSurvey/getPostPurchaseSurveyUsecaseRes';

interface GetPostPurchaseSurveyProduct {
  shopifyId?: number;
  shipheroId?: string;
  dbProductId?: number;
  title: string;
  sku: string;
  vendor: string;
  images: GetPostPurchaseSurveyImage[];
}

export interface GetPostPurchaseSurveyImage {
  position: number;
  alt: string | null;
  src: string;
}

export interface GetPostPurchaseSurveyUseCaseInterface {
  getPostPurchaseSurvey({
    email,
    orderNumber,
  }: GetPostPurchaseSurveyUsecaseArgs): Promise<
    GetPostPurchaseSurveyUsecaseRes[]
  >;
}

@Injectable()
export class GetPostPurchaseSurveyUseCase
  implements GetPostPurchaseSurveyUseCaseInterface
{
  constructor(
    @Inject('ShipheroRepoInterface')
    private shipheroRepo: ShipheroRepoInterface,
    @Inject('QuestionPostPurchaseSurveyRepoInterface')
    private questionPostPurchaseSurveyRepo: QuestionPostPurchaseSurveyRepoInterface,
    @Inject('CustomerPostPurchaseSurveyRepoInterface')
    private customerPostPurchaseSurveyRepo: CustomerPostPurchaseSurveyRepoInterface,
    @Inject('ProductPostPurchaseSurveyRepoInterface')
    private productPostPurchaseSurveyRepo: ProductPostPurchaseSurveyRepoInterface,
  ) {}

  async getPostPurchaseSurvey({
    email,
    orderNumber,
  }: GetPostPurchaseSurveyUsecaseArgs): Promise<
    GetPostPurchaseSurveyUsecaseRes[]
  > {
    // Get last order products from shiphero
    let lastOrder: ShipheroGetLastOrderRes =
      await this.shipheroRepo.getLastOrder({ email });

    if (orderNumber) {
      lastOrder.orderNumber = orderNumber;
    }

    let vendors: ShipherpGetVendorsRes[] = await this.shipheroRepo.getVendors();

    let detailedProductList: GetPostPurchaseSurveyProduct[] = await Promise.all(
      lastOrder.products.map(async (lastProduct) => {
        const productDetail: ShipheroGetProductDetailRes =
          await this.shipheroRepo.getProductDetail({ sku: lastProduct.sku });

        let productImages: GetPostPurchaseSurveyImage[] =
          productDetail.images.map((image) => {
            return {
              position: image.position,
              alt: `${productDetail.name}`,
              src: image.src,
            };
          });

        let productVendor: string;
        // if productData has no vendor information, then prodiuctVendor is going to be 'Teatis Meals'
        if (productDetail.vendors.length === 0) {
          productVendor = 'Teatis Meals';
        } else {
          // else, find the product vendor which mathces with all the vendors array
          for (let vendor of vendors) {
            if (vendor.id === productDetail.vendors[0].id) {
              productVendor = vendor.name;
              break;
            }
          }
        }
        let product: GetPostPurchaseSurveyProduct = {
          shipheroId: productDetail.id,
          sku: productDetail.sku,
          title: productDetail.name,
          images: productImages,
          vendor: productVendor,
        };
        return product;
      }),
    );

    // Upsert productId in Database and set productId in detailedProductList
    detailedProductList = await Promise.all(
      detailedProductList.map(async (product: GetPostPurchaseSurveyProduct) => {
        const upsertedProduct: TeatisDBUpsertProductRes =
          await this.productPostPurchaseSurveyRepo.upsertProduct({
            sku: product.sku,
          });
        return {
          ...product,
          dbProductId: upsertedProduct.id,
        };
      }),
    );

    const { surveyId }: TeatisDBGetSurveyIdRes =
      await this.questionPostPurchaseSurveyRepo.getSurveyId({
        surveyName: 'post-purchase',
      });

    const postPurchaseSurveyQuestions: TeatisDBGetSurveyQuestionsRes[] =
      await this.questionPostPurchaseSurveyRepo.getSurveyQuestions({
        surveyId,
      });

    const customer: TeatisDBGetCustomerRes =
      await this.customerPostPurchaseSurveyRepo.getCustomer({ email });

    let personalizedPostPurchaseSurveyQuestions: GetPostPurchaseSurveyUsecaseRes[] =
      [];
    postPurchaseSurveyQuestions.map((question) => {
      let personalizedQuestion: GetPostPurchaseSurveyUsecaseRes;
      personalizedQuestion = {
        ...question,
        shopifyOrderNumber: lastOrder.orderNumber,
        customerId: customer.id,
        answerText: undefined,
        answerBool: undefined,
        answerNumeric: undefined,
        answerSingleOptionId: undefined,
        answerOptions: undefined,
        reason: undefined,
        title: undefined,
        content: undefined,
      };

      if (question.label.includes('PRODUCT_NAME')) {
        detailedProductList.forEach((product) => {
          const replacedLabel = question.label.replace(
            'PRODUCT_NAME',
            product.title,
          );
          personalizedPostPurchaseSurveyQuestions.push({
            ...personalizedQuestion,
            label: replacedLabel,
            productId: product.dbProductId,
          });
        });
      } else {
        personalizedPostPurchaseSurveyQuestions.push(personalizedQuestion);
      }
    });

    const customerAnswers: TeatisDBGetCustomerProductFeedbackAnswersRes[] =
      await this.customerPostPurchaseSurveyRepo.getCustomerProductFeedbackAnswers(
        { shopifyOrderNumber: lastOrder.orderNumber },
      );

    await Promise.all(
      personalizedPostPurchaseSurveyQuestions.map(
        async (question: GetPostPurchaseSurveyUsecaseRes): Promise<void> => {
          customerAnswers.forEach(
            async (
              customerAnswer: TeatisDBGetCustomerProductFeedbackAnswersRes,
            ): Promise<void> => {
              if (customerAnswer.productId === question.productId) {
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
                  switch (question.surveyQuestionAnswerType) {
                    case 'boolean':
                      question.answerBool = customerAnswer.answerBool;
                      break;
                    case 'numeric':
                      question.answerNumeric = customerAnswer.answerNumeric;
                      break;
                    case 'text':
                      question.answerText = customerAnswer.answerText;
                      break;
                    case 'singleAnswer':
                      question.answerSingleOptionId =
                        customerAnswer.answerSingleOptionId;
                      break;
                    case 'multipleAnswer':
                      question.answerOptions =
                        await this.productPostPurchaseSurveyRepo.getCustomerAnswerOptions(
                          { customerQuestionAnswerId: customerAnswer.id },
                        );
                      break;
                    default:
                      break;
                  }
                }
              }
            },
          );
        },
      ),
    );

    return personalizedPostPurchaseSurveyQuestions;
  }
}

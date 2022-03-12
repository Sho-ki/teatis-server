import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../prisma.service';

interface GetCustomerAnswersArgs {
  email: string;
  orderNumber: string;
}

interface GetCustomerWithAnswersRes {
  id: number;
  email: string;
  customerAnswers?: GetCustomerWithAnswersResCustomerAnswer[];
}

interface GetCustomerWithAnswersResCustomerAnswer {
  id: number;
  surveyQuestionId: number;
  answer?: {
    text?: string;
    numeric?: number;
    singleOptionId?: number;
    multipleOptionIds?: number[];
    bool?: boolean;
  };
  reason?: string;
  title?: string;
  content?: string;
  answerCount: number;
  productId?: number;
  shopifyOrderNumber: string;
}

interface GetAnswerCountArgs {
  customerId: number;
}

interface GetAnswerCountRes {
  currentMaxAnswerCount: number;
}

interface PostPostPurchaseSurveyCustomerAnswerProductFeedbackArgs {
  id: number;
  customerId: number;
  shopifyOrderNumber: string;
  productId: number;
  answer: {
    text?: string;
    numeric?: number;
    singleOption?: { id: number; label: string; name: string };
    multipleOptions?: { id: number; label: string; name: string }[];
    bool?: boolean;
  };
  title?: string;
  content?: string;
  reason?: string;
  currentMaxAnswerCount: number;
}

interface PostPostPurchaseSurveyCustomerAnswerProductFeedbackRes {
  id: number;
}

export interface CustomerPostPurchaseSurveyRepoInterface {
  getCustomerWithAnswers({
    email,
    orderNumber,
  }: GetCustomerAnswersArgs): Promise<[GetCustomerWithAnswersRes, Error]>;

  postPostPurchaseSurveyCustomerAnswerProductFeedback({
    id,
    customerId,
    shopifyOrderNumber,
    productId,
    answer,
    title,
    content,
    reason,
    currentMaxAnswerCount,
  }: PostPostPurchaseSurveyCustomerAnswerProductFeedbackArgs): Promise<
    [PostPostPurchaseSurveyCustomerAnswerProductFeedbackRes, Error]
  >;

  getAnswerCount({
    customerId,
  }: GetAnswerCountArgs): Promise<[GetAnswerCountRes, Error]>;

  checkIsNewSurveyAnswer(
    shopifyOrderNumber: string,
    currentMaxAnswerCount: number,
  ): Promise<boolean>;
}

@Injectable()
export class CustomerPostPurchaseSurveyRepo
  implements CustomerPostPurchaseSurveyRepoInterface
{
  constructor(private prisma: PrismaService) {}

  async checkIsNewSurveyAnswer(
    shopifyOrderNumber: string,
    currentMaxAnswerCount: number,
  ): Promise<boolean> {
    let count = await this.prisma.surveyQuestionAnswerProductFeedback.aggregate(
      {
        where: { shopifyOrderNumber, answerCount: currentMaxAnswerCount },
        _max: { answerCount: true },
      },
    );
    return count._max.answerCount !== currentMaxAnswerCount;
  }

  async getAnswerCount({
    customerId,
  }: GetAnswerCountArgs): Promise<[GetAnswerCountRes, Error]> {
    let count = await this.prisma.surveyQuestionAnswerProductFeedback.aggregate(
      {
        where: { customerId },
        _max: {
          answerCount: true,
        },
      },
    );

    return [{ currentMaxAnswerCount: count._max.answerCount }, null];
  }

  async getCustomerWithAnswers({
    email,
    orderNumber,
  }: GetCustomerAnswersArgs): Promise<[GetCustomerWithAnswersRes, Error]> {
    let getCustomerRes = await this.prisma.customers.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        surveyQuestionAnswerProductFeedback: {
          where: { shopifyOrderNumber: orderNumber },
          select: {
            id: true,
            customerId: true,
            surveyQuestionId: true,
            answerText: true,
            answerNumeric: true,
            answerBool: true,
            intermediateSurveyQuestionAnswerProduct: {
              select: {
                surveyQuestionOption: {
                  select: { label: true, id: true, name: true },
                },
              },
            },
            reason: true,
            title: true,
            content: true,
            answerCount: true,
            productId: true,
            shopifyOrderNumber: true,
          },
        },
      },
    });

    if (!getCustomerRes) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getCustomer failed',
        },
      ];
    }
    let customerAnswers: GetCustomerWithAnswersResCustomerAnswer[] = [];
    for (let customerAnswer of getCustomerRes.surveyQuestionAnswerProductFeedback) {
      let answer: GetCustomerWithAnswersResCustomerAnswer = {
        id: customerAnswer.id,
        surveyQuestionId: customerAnswer.surveyQuestionId,
        answer: {
          text: customerAnswer.answerText,
          numeric: customerAnswer.answerNumeric,
          singleOptionId: customerAnswer.surveyQuestionId,
          multipleOptionIds:
            customerAnswer.intermediateSurveyQuestionAnswerProduct.length > 0
              ? customerAnswer.intermediateSurveyQuestionAnswerProduct.map(
                  (option) => {
                    return option.surveyQuestionOption.id;
                  },
                )
              : [],
          bool: customerAnswer.answerBool,
        },
        reason: customerAnswer.reason,
        title: customerAnswer.title,
        content: customerAnswer.content,
        answerCount: customerAnswer.answerCount,
        productId: customerAnswer.productId,
        shopifyOrderNumber: customerAnswer.shopifyOrderNumber,
      };
      customerAnswers.push(answer);
    }

    return [
      { id: getCustomerRes.id, email: getCustomerRes.email, customerAnswers },
      null,
    ];
  }

  async postPostPurchaseSurveyCustomerAnswerProductFeedback({
    id,
    customerId,
    shopifyOrderNumber,
    productId,
    answer,
    title,
    content,
    reason,
    currentMaxAnswerCount,
  }: PostPostPurchaseSurveyCustomerAnswerProductFeedbackArgs): Promise<
    [PostPostPurchaseSurveyCustomerAnswerProductFeedbackRes, Error]
  > {
    let prismaQuery: Prisma.SurveyQuestionAnswerProductFeedbackUpsertArgs = {
      where: {
        CustomerSurveyQuestionProductFeedbackIdentifier: {
          shopifyOrderNumber,
          surveyQuestionId: id,
          productId,
        },
      },
      create: undefined,
      update: undefined,
    };
    if (answer.singleOption) {
      prismaQuery = {
        ...prismaQuery,
        create: {
          customer: {
            connect: { id: customerId },
          },
          surveyQuestion: {
            connect: { id: id },
          },
          product: {
            connect: { id: productId },
          },
          answerOption: {
            connect: { id: answer.singleOption.id },
          },
          title,
          content,
          reason,
          shopifyOrderNumber,
          answerCount: currentMaxAnswerCount,
        },
        update: {
          customer: {
            connect: { id: customerId },
          },
          surveyQuestion: {
            connect: { id: id },
          },
          product: {
            connect: { id: productId },
          },
          answerOption: {
            connect: { id: answer.singleOption.id },
          },
          title,
          content,
          reason,
          shopifyOrderNumber,
          answerCount: currentMaxAnswerCount,
        },
      };
    } else if (answer.multipleOptions) {
      prismaQuery = {
        ...prismaQuery,
        create: {
          customer: {
            connect: { id: customerId },
          },
          surveyQuestion: {
            connect: { id: id },
          },

          product: {
            connect: { id: productId },
          },
          title,
          content,
          reason,
          shopifyOrderNumber,
          answerCount: currentMaxAnswerCount,
          intermediateSurveyQuestionAnswerProduct: {
            create: answer.multipleOptions.map((option) => {
              return { surveyQuestionOptionId: option.id };
            }),
          },
        },
        update: {
          customer: {
            connect: { id: customerId },
          },
          surveyQuestion: {
            connect: { id: id },
          },
          product: {
            connect: { id: productId },
          },
          title,
          content,
          reason,
          shopifyOrderNumber,
          answerCount: currentMaxAnswerCount,
          // intermediateSurveyQuestionAnswerProduct: {
          //   // needs to be updated
          //   deleteMany: {},
          //   connectOrCreate: answerOptions.map((option) => {
          //     return { surveyQuestionOptionId: option.id, };
          //   }),
          // },
        },
      };
    } else {
      prismaQuery = {
        ...prismaQuery,
        create: {
          customer: {
            connect: { id: customerId },
          },
          surveyQuestion: {
            connect: { id: id },
          },
          product: {
            connect: { id: productId },
          },
          answerBool: answer.bool,
          answerNumeric: answer.numeric,
          answerText: answer.text,
          title,
          content,
          reason,
          shopifyOrderNumber,
          answerCount: currentMaxAnswerCount,
        },
        update: {
          customer: {
            connect: { id: customerId },
          },
          surveyQuestion: {
            connect: { id: id },
          },
          product: {
            connect: { id: productId },
          },
          answerBool: answer.bool,
          answerNumeric: answer.numeric,
          answerText: answer.text,
          title,
          content,
          reason,
          shopifyOrderNumber,
          answerCount: currentMaxAnswerCount,
        },
      };
    }

    let res = await this.prisma.surveyQuestionAnswerProductFeedback.upsert(
      prismaQuery,
    );
    return [{ id: res.id }, null];
  }
}

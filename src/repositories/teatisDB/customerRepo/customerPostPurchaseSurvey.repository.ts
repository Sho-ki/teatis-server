import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../prisma.service';

interface GetCustomerAnswerOptionsArgs {
  customerQuestionAnswerId: number;
}

export interface GetCustomerAnswerOptionsRes {
  options: GetCustomerAnswerOptionsResElement[];
}

interface GetCustomerAnswerOptionsResElement {
  id: number;
  label: string;
  name: string;
}

interface GetCustomerAnswersArgs {
  email: string;
  orderNumber: string;
}

interface GetCustomerWithAnswersRes {
  id: number;
  email: string;
  customerAnswers?: GetCustomerWithAnswersResElement[];
}

interface GetCustomerWithAnswersResElement {
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

export interface GetCustomerProductFeedbackAnswersRes {
  customerAnswers: GetCustomerProductFeedbackAnswersResElement[];
}

interface GetCustomerProductFeedbackAnswersResElement {
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
  productId: number;
  shopifyOrderNumber: string;
}

interface GetAnswerCountArgs {
  customerId: number;
}

export interface GetAnswerCountRes {
  currentMaxAnswerCount: number;
}

interface GetCustomerArgs {
  email: string;
}

export interface GetCustomerRes {
  id: number;
  email: string;
}

interface PostPostPurchaseSurveyCustomerAnswerProductFeedbackArgs {
  id: number;
  customerId: number;
  shopifyOrderNumber: string;
  productId: number;
  answerBool: boolean | null;
  answerNumeric: number | null;
  answerOptions: { id: number; label: string; name: string }[] | null;
  answerSingleOptionId: number | null;
  answerText: string | null;
  title: string | null;
  content: string | null;
  reason: string | null;
  currentMaxAnswerCount: number;
}

export interface PostPostPurchaseSurveyCustomerAnswerProductFeedbackRes {
  id: number;
}

export interface CustomerPostPurchaseSurveyRepoInterface {
  getCustomerWithAnswers({
    email,
    orderNumber,
  }: GetCustomerAnswersArgs): Promise<[GetCustomerWithAnswersRes, Error]>;
  getCustomerAnswerOptions({
    customerQuestionAnswerId,
  }: GetCustomerAnswerOptionsArgs): Promise<
    [GetCustomerAnswerOptionsRes, Error]
  >;

  getCustomer({ email }: GetCustomerArgs): Promise<[GetCustomerRes, Error]>;
  // getCustomerProductFeedbackAnswers({
  //   shopifyOrderNumber,
  // }: GetCustomerProductFeedbackAnswersArgs): Promise<
  //   [GetCustomerProductFeedbackAnswersRes, Error]
  // >;

  postPostPurchaseSurveyCustomerAnswerProductFeedback({
    id,
    customerId,
    shopifyOrderNumber,
    productId,
    answerBool,
    answerNumeric,
    answerOptions,
    answerSingleOptionId,
    answerText,
    title,
    content,
    reason,
    currentMaxAnswerCount,
  }: PostPostPurchaseSurveyCustomerAnswerProductFeedbackArgs): Promise<
    [PostPostPurchaseSurveyCustomerAnswerProductFeedbackRes, Error]
  >;

  getAnswerCount({
    customerId,
  }: GetAnswerCountArgs): Promise<GetAnswerCountRes>;

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
  }: GetAnswerCountArgs): Promise<GetAnswerCountRes> {
    let count = await this.prisma.surveyQuestionAnswerProductFeedback.aggregate(
      {
        where: { customerId },
        _max: {
          answerCount: true,
        },
      },
    );
    return { currentMaxAnswerCount: count._max.answerCount };
  }

  async getCustomer({
    email,
  }: GetCustomerArgs): Promise<[GetCustomerRes, Error]> {
    let getCustomerRes = await this.prisma.customers.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!getCustomerRes) {
      return [
        null,
        { name: 'Internal Server Error', message: 'getCustomer failed' },
      ];
    }
    return [getCustomerRes, null];
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
        { name: 'Internal Server Error', message: 'getCustomer failed' },
      ];
    }
    let customerAnswers: GetCustomerWithAnswersResElement[] = [];
    for (let customerAnswer of getCustomerRes.surveyQuestionAnswerProductFeedback) {
      let answer: GetCustomerWithAnswersResElement = {
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

  async getCustomerAnswerOptions({
    customerQuestionAnswerId,
  }: GetCustomerAnswerOptionsArgs): Promise<
    [GetCustomerAnswerOptionsRes, Error]
  > {
    let customerAnswerOptions =
      await this.prisma.intermediateSurveyQuestionAnswerService.findMany({
        where: {
          surveyQuestionAnswerServiceFeedbackId: customerQuestionAnswerId,
        },
        select: {
          surveyQuestionOptionId: true,
          surveyQuestionOption: {
            select: { label: true, id: true, name: true },
          },
        },
      });

    let options: GetCustomerAnswerOptionsResElement[] = [];
    for (let customerAnswerOption of customerAnswerOptions) {
      const id = customerAnswerOption?.surveyQuestionOption.id,
        label = customerAnswerOption?.surveyQuestionOption?.label,
        name = customerAnswerOption?.surveyQuestionOption?.name;
      if (id && label && name) {
        options.push({ id, label, name });
      }
    }

    return [{ options }, null];
  }

  async postPostPurchaseSurveyCustomerAnswerProductFeedback({
    id,
    customerId,
    shopifyOrderNumber,
    productId,
    answerBool,
    answerNumeric,
    answerOptions,
    answerSingleOptionId,
    answerText,
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
    if (answerSingleOptionId) {
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
            connect: { id: answerSingleOptionId },
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
            connect: { id: answerSingleOptionId },
          },
          title,
          content,
          reason,
          shopifyOrderNumber,
          answerCount: currentMaxAnswerCount,
        },
      };
    } else if (answerOptions) {
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
            create: answerOptions.map((option) => {
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
          answerBool,
          answerNumeric,
          answerText,
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
          answerBool,
          answerNumeric,
          answerText,
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

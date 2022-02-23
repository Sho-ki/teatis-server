import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../prisma.service';

interface GetCustomerProductFeedbackAnswersArgs {
  shopifyOrderNumber: string;
}

export interface GetCustomerProductFeedbackAnswersRes {
  id: number;
  customerId: number;
  surveyQuestionId: number;
  answerSingleOptionId?: number;
  answerNumeric?: number;
  answerText?: string;
  answerBool?: boolean;
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

export interface CustomerPostPurchaseSurveyRepoInterface {
  getCustomer({ email }: GetCustomerArgs): Promise<GetCustomerRes>;
  getCustomerProductFeedbackAnswers({
    shopifyOrderNumber,
  }: GetCustomerProductFeedbackAnswersArgs): Promise<
    GetCustomerProductFeedbackAnswersRes[]
  >;

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
  }: any): Promise<any>;

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

  async getCustomer({ email }: GetCustomerArgs): Promise<GetCustomerRes> {
    return await this.prisma.customers.findUnique({
      where: { email },
      select: { id: true, email: true },
    });
  }
  async getCustomerProductFeedbackAnswers({
    shopifyOrderNumber,
  }: GetCustomerProductFeedbackAnswersArgs): Promise<
    GetCustomerProductFeedbackAnswersRes[]
  > {
    let customerAnswers =
      await this.prisma.surveyQuestionAnswerProductFeedback.findMany({
        where: {
          shopifyOrderNumber,
        },
      });
    return customerAnswers.map((answer) => {
      return {
        ...answer,
      };
    });
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
  }: any): Promise<any> {
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
            create: answerOptions.map((id: number) => {
              return { surveyQuestionOptionId: id };
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
          intermediateSurveyQuestionAnswerProduct: {
            // needs to be updated
            deleteMany: {},
            connectOrCreate: answerOptions.map((id: number) => {
              return { surveyQuestionOptionId: id };
            }),
          },
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

    let aaa = await this.prisma.surveyQuestionAnswerProductFeedback.upsert(
      prismaQuery,
    );
    console.log(aaa);
  }
}

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Answer } from '@Domains/Answer';
import { CustomerAnswer } from '@Domains/CustomerAnswer';

import { PrismaService } from '../../../prisma.service';

interface GetCustomerAnswersArgs {
  email: string;
  orderNumber: string;
}

interface GetAnswerCountArgs {
  customerId: number;
}

interface GetAnswerCountRes {
  currentMaxAnswerCount: number;
}

interface PostPostPurchaseSurveyCustomerAnswerArgs {
  id: number;
  customerId: number;
  orderNumber: string;
  productId: number;
  responseId: string;
  answer: {
    text?: string;
    numeric?: number;
    singleOption?: { id: number, label: string, name: string };
    multipleOptions?: { id: number, label: string, name: string }[];
    bool?: boolean;
  };
  title?: string;
  content?: string;
  reason?: string;
  currentMaxAnswerCount: number;
}

interface PostPostPurchaseSurveyCustomerAnswerRes {
  id: number;
}

interface CheckIsNewSurveyAnswerArgs {
  orderNumber: string;
  currentMaxAnswerCount: number;
}

interface CheckIsNewSurveyAnswerRes {
  isNewSurveyAnswer: boolean;
}

export interface CustomerPostPurchaseSurveyRepositoryInterface {
  getCustomerAnswers({
    email,
    orderNumber,
  }: GetCustomerAnswersArgs): Promise<[CustomerAnswer?, Error?]>;

  postPostPurchaseSurveyCustomerAnswer({
    id,
    customerId,
    orderNumber,
    responseId,
    productId,
    answer,
    title,
    content,
    reason,
    currentMaxAnswerCount,
  }: PostPostPurchaseSurveyCustomerAnswerArgs): Promise<
    [PostPostPurchaseSurveyCustomerAnswerRes?, Error?]
  >;

  getAnswerCount({ customerId }: GetAnswerCountArgs): Promise<[GetAnswerCountRes?, Error?]>;

  checkIsNewSurveyAnswer({
    orderNumber,
    currentMaxAnswerCount,
  }: CheckIsNewSurveyAnswerArgs): Promise<[CheckIsNewSurveyAnswerRes?, Error?]>;
}

@Injectable()
export class CustomerPostPurchaseSurveyRepository
implements CustomerPostPurchaseSurveyRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async checkIsNewSurveyAnswer({
    orderNumber,
    currentMaxAnswerCount,
  }: CheckIsNewSurveyAnswerArgs): Promise<
    [CheckIsNewSurveyAnswerRes?, Error?]
  > {
    const count = await this.prisma.surveyQuestionAnswer.aggregate({
      where: { orderNumber, answerCount: currentMaxAnswerCount },
      _max: { answerCount: true },
    });
    return [{ isNewSurveyAnswer: count._max.answerCount !== currentMaxAnswerCount }];
  }

  async getAnswerCount({ customerId }: GetAnswerCountArgs): Promise<[GetAnswerCountRes?, Error?]> {
    const res = await this.prisma.surveyQuestionAnswer.aggregate({
      where: { customerId },
      _max: { answerCount: true },
    });
    const currentMaxAnswerCount = res?._max?.answerCount;

    return [{ currentMaxAnswerCount }];
  }

  async getCustomerAnswers({
    email,
    orderNumber,
  }: GetCustomerAnswersArgs): Promise<[CustomerAnswer?, Error?]> {
    const getCustomerRes = await this.prisma.customers.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        uuid: true,
        surveyQuestionAnswer: {
          where: { orderNumber },
          select: {
            id: true,
            customerId: true,
            surveyQuestionId: true,
            answerText: true,
            answerNumeric: true,
            answerBool: true,
            intermediateSurveyQuestionAnswerProduct: { select: { surveyQuestionOption: { select: { label: true, id: true, name: true } } } },
            responseId: true,
            reason: true,
            title: true,
            content: true,
            answerCount: true,
            productId: true,
            orderNumber: true,
          },
        },
      },
    });

    const customerAnswers: Answer[] = [];
    for (const customerAnswer of getCustomerRes.surveyQuestionAnswer) {
      const answer: Answer = {
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
        responseId: customerAnswer.responseId,
        reason: customerAnswer.reason,
        title: customerAnswer.title,
        content: customerAnswer.content,
        answerCount: customerAnswer.answerCount,
        productId: customerAnswer?.productId,
        orderNumber: customerAnswer.orderNumber,
      };
      customerAnswers.push(answer);
    }

    return [
      {
        id: getCustomerRes.id,
        email: getCustomerRes.email,
        uuid: getCustomerRes.uuid,
        customerAnswers,
      },
    ];
  }

  async postPostPurchaseSurveyCustomerAnswer({
    id,
    customerId,
    orderNumber,
    responseId,
    productId,
    answer,
    title,
    content,
    reason,
    currentMaxAnswerCount,
  }: PostPostPurchaseSurveyCustomerAnswerArgs): Promise<
    [PostPostPurchaseSurveyCustomerAnswerRes?, Error?]
  > {
    let prismaQuery: Prisma.SurveyQuestionAnswerUpsertArgs = {
      where: { responseId },
      create: undefined,
      update: undefined,
    };
    if (answer.singleOption) {
      prismaQuery = {
        ...prismaQuery,
        create: {
          customer: { connect: { id: customerId } },
          surveyQuestion: { connect: { id } },
          product: productId
            ? { connect: { id: productId } }
            : {},
          answerOption: { connect: { id: answer.singleOption.id } },
          responseId,
          title,
          content,
          reason,
          orderNumber,
          answerCount: currentMaxAnswerCount,
        },
        update: {
          customer: { connect: { id: customerId } },
          surveyQuestion: { connect: { id } },
          product: productId
            ? { connect: { id: productId } }
            : {},
          answerOption: { connect: { id: answer.singleOption.id } },
          responseId,
          title,
          content,
          reason,
          orderNumber,
          answerCount: currentMaxAnswerCount,
        },
      };
    } else if (answer.multipleOptions) {
      prismaQuery = {
        ...prismaQuery,
        create: {
          customer: { connect: { id: customerId } },
          surveyQuestion: { connect: { id } },

          product: productId
            ? { connect: { id: productId } }
            : {},
          responseId,
          title,
          content,
          reason,
          orderNumber,
          answerCount: currentMaxAnswerCount,
          intermediateSurveyQuestionAnswerProduct: {
            create: answer.multipleOptions.map((option) => {
              return { surveyQuestionOptionId: option.id };
            }),
          },
        },
        update: {
          customer: { connect: { id: customerId } },
          surveyQuestion: { connect: { id } },
          product: { connect: { id: productId } },
          responseId,
          title,
          content,
          reason,
          orderNumber,
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
          customer: { connect: { id: customerId } },
          surveyQuestion: { connect: { id } },
          product: productId
            ? { connect: { id: productId } }
            : {},
          answerBool: answer.bool,
          answerNumeric: answer.numeric,
          answerText: answer.text,
          responseId,
          title,
          content,
          reason,
          orderNumber,
          answerCount: currentMaxAnswerCount,
        },
        update: {
          customer: { connect: { id: customerId } },
          surveyQuestion: { connect: { id } },
          product: productId
            ? { connect: { id: productId } }
            : {},
          answerBool: answer.bool,
          answerNumeric: answer.numeric,
          answerText: answer.text,
          responseId,
          title,
          content,
          reason,
          orderNumber,
          answerCount: currentMaxAnswerCount,
        },
      };
    }

    const res = await this.prisma.surveyQuestionAnswer.upsert(prismaQuery);

    return [{ id: res.id }];
  }
}

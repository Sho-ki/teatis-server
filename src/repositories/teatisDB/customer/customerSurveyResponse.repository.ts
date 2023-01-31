import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../prisma.service';
import { PostPurchaseSurveyAnswer } from '@Domains/PostPurchaseSurveyAnswer';
import { ReturnValueType } from '@Filters/customError';
import { ProductHasGlucoseImpact } from '@Domains/PostPurchaseSurvey';
// import { SURVEY_NAME } from '../../../usecases/utils/surveyName';

// interface GetCustomerLatestSurveyArgs {
//   customerId: number;
//   surveyName: SURVEY_NAME;
// }

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
  glucoseImpact?: ProductHasGlucoseImpact;
  currentMaxAnswerCount: number;
}

interface CheckIsNewSurveyAnswerArgs {
  orderNumber: string;
  currentMaxAnswerCount: number;
}

interface CheckIsNewSurveyAnswerRes {
  isNewSurveyAnswer: boolean;
}

export interface CustomerPostPurchaseSurveyRepositoryInterface {
  // getCustomerLatestSurvey({
  //   customerId,
  //   surveyName,
  // }: GetCustomerLatestSurveyArgs): Promise<ReturnValueType<CustomerAnswer>>;

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
    glucoseImpact,
    currentMaxAnswerCount,
  }: PostPostPurchaseSurveyCustomerAnswerArgs): Promise<
    ReturnValueType<PostPurchaseSurveyAnswer>
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

  // async getCustomerLatestSurvey({
  //   customerId,
  //   surveyName,
  // }: GetCustomerLatestSurveyArgs): Promise<ReturnValueType<CustomerAnswer>> {
  //   const getCustomerRes = await this.prisma.customerSurveyHistory.findMany({
  //     where: { survey: { name: surveyName } },
  //     orderBy: { createdAt: 'desc' }, take: 1,
  //     include: {
  //       survey: {
  //         where: { orderNumber },
  //         select: {
  //           id: true,
  //           customerId: true,
  //           surveyQuestionId: true,
  //           answerText: true,
  //           answerNumeric: true,
  //           answerBool: true,
  //           // intermediateSurveyQuestionAnswerProduct:
  //           // { select: { surveyQuestionOption: { select: { label: true, id: true, name: true } } } },
  //           responseId: true,
  //           reason: true,
  //           title: true,
  //           content: true,
  //           answerCount: true,
  //           productId: true,
  //           orderNumber: true,
  //           glucoseImpact: true,
  //         },
  //       },
  //     },
  //   });
  //   const customerAnswers: Answer[] = [];
  //   for (const customerAnswer of getCustomerRes.surveyQuestionAnswer) {
  //     const answer: Answer = {
  //       id: customerAnswer.id,
  //       surveyQuestionId: customerAnswer.surveyQuestionId,
  //       answer: {
  //         text: customerAnswer.answerText,
  //         numeric: customerAnswer.answerNumeric,
  //         singleOptionId: customerAnswer.surveyQuestionId,
  //         // multipleOptionIds:
  //         //   customerAnswer.intermediateSurveyQuestionAnswerProduct.length > 0
  //         //     ? customerAnswer.intermediateSurveyQuestionAnswerProduct.map(
  //         //       (option) => {
  //         //         return option.surveyQuestionOption.id;
  //         //       },
  //         //     )
  //         //     : [],
  //         bool: customerAnswer.answerBool,
  //       },
  //       responseId: customerAnswer.responseId,
  //       reason: customerAnswer.reason,
  //       title: customerAnswer.title,
  //       content: customerAnswer.content,
  //       answerCount: customerAnswer.answerCount,
  //       productId: customerAnswer?.productId,
  //       orderNumber: customerAnswer.orderNumber,
  //       glucoseImpact: customerAnswer.glucoseImpact,
  //     };
  //     customerAnswers.push(answer);
  //   }

  //   return [
  //     {
  //       id: getCustomerRes.id,
  //       email: getCustomerRes.email,
  //       uuid: getCustomerRes.uuid,
  //       customerAnswers,
  //     },
  //   ];
  // }

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
    glucoseImpact,
    currentMaxAnswerCount,
  }: PostPostPurchaseSurveyCustomerAnswerArgs): Promise<
    ReturnValueType<PostPurchaseSurveyAnswer>
  > {
    let prismaQuery: Prisma.SurveyQuestionAnswerUpsertArgs = {
      where: { responseId },
      create: undefined,
      update: undefined,
    };
    const productSatisfactionCreateQuery = {
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
      glucoseImpact,
      answerCount: currentMaxAnswerCount,
    };
    const productSatisfactionUpdateQuery = {
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
      glucoseImpact,
      answerCount: currentMaxAnswerCount,
    };
    if (answer.singleOption) {
      prismaQuery = {
        ...prismaQuery,
        create: { ...productSatisfactionCreateQuery, surveyQuestion: { connect: { id: answer.singleOption.id } } },
        update: { ...productSatisfactionUpdateQuery, surveyQuestion: { connect: { id: answer.singleOption.id } } },
      };
    }
    // else if (answer.multipleOptions) {
    //   prismaQuery = {
    //     ...prismaQuery,
    //     create: {
    //       ...productSatisfactionCreateQuery,
    //       intermediateSurveyQuestionAnswerProduct: {
    //         create: answer.multipleOptions.map((option) => {
    //           return { surveyQuestionOptionId: option.id };
    //         }),
    //       },
    //     },
    //     update: {
    //       ...productSatisfactionUpdateQuery,
    //       product: { connect: { id: productId } },
    //       // intermediateSurveyQuestionAnswerProduct: {
    //       //   // needs to be updated
    //       //   deleteMany: {},
    //       //   connectOrCreate: answerOptions.map((option) => {
    //       //     return { surveyQuestionOptionId: option.id, };
    //       //   }),
    //       // },
    //     },
    //   };
    // }
    else {
      prismaQuery = {
        ...prismaQuery,
        create: {
          ...productSatisfactionCreateQuery,
          answerBool: answer.bool,
          answerNumeric: answer.numeric,
          answerText: answer.text,
        },
        update: {
          ...productSatisfactionUpdateQuery,
          answerBool: answer.bool,
          answerNumeric: answer.numeric,
          answerText: answer.text,
        },
      };
    }

    const res = await this.prisma.surveyQuestionAnswer.upsert(prismaQuery);

    return [{ id: res.id }];
  }
}

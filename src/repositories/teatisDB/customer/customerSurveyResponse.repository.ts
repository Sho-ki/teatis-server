import { Injectable } from '@nestjs/common';
// import { Prisma, ResponseType } from '@prisma/client';

import { PrismaService } from '../../../prisma.service';
// import { ReturnValueType } from '@Filters/customError';
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

  // postCustomerResponseWithProduct({
  //   customerId,
  //   orderNumber,
  //   surveyId,
  //   responses,
  // }: PostCustomerResponseWithProductsArgs): Promise<
  //   ReturnValueType<PostPurchaseSurveyAnswer>
  // >;

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

  // async postCustomerResponseWithProduct({
  //   customerId,
  //   orderNumber,
  //   surveyId,
  //   responses,
  // }: PostCustomerResponseWithProductsArgs): Promise<
  //   ReturnValueType<PostPurchaseSurveyAnswer>
  // > {
  //   const response = await this.prisma.customerSurveyHistory.upsert(
  //     {
  //       where: { CustomerOrderSurveyHistoryIdentifier: { customerId, surveyId, orderNumber } },
  //       create: { customerId, surveyId, orderNumber },
  //       update: { customerId, surveyId, orderNumber },
  //     });

  // }
}

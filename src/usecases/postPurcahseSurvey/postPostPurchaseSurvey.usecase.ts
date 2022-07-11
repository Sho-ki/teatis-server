import { Inject, Injectable } from '@nestjs/common';

import { PostPostPurchaseSurveyDto } from '@Controllers/discoveries/dtos/postPostPurchaseSurvey';
import { ShipheroRepositoryInterface } from '@Repositories/shiphero/shiphero.repository';
import { QuestionPostPurchaseSurveyRepositoryInterface } from '@Repositories/teatisDB/question/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepositoryInterface } from '@Repositories/teatisDB/customer/customerPostPurchaseSurvey.repository';

export interface PostPostPurchaseSurveyUsecaseInterface {
  postPostPurchaseSurvey({
    id,
    customerId,
    orderNumber,
    productId,
    responseId,
    answer,
    title,
    content,
    reason,
  }: PostPostPurchaseSurveyDto): Promise<any>;
}

interface PostPostPurchaseSurveyRes {
  id: number;
}

@Injectable()
export class PostPostPurchaseSurveyUsecase
  implements PostPostPurchaseSurveyUsecaseInterface
{
  constructor(
    @Inject('CustomerPostPurchaseSurveyRepositoryInterface')
    private customerPostPurchaseSurveyRepository: CustomerPostPurchaseSurveyRepositoryInterface,
  ) {}

  async postPostPurchaseSurvey({
    id,
    customerId,
    orderNumber,
    productId,
    answer,
    responseId,
    title,
    content,
    reason,
  }: PostPostPurchaseSurveyDto): Promise<[PostPostPurchaseSurveyRes, Error]> {
    let [answerCount, answerCountError] =
      await this.customerPostPurchaseSurveyRepository.getAnswerCount({
        customerId,
      });
    if (answerCountError) {
      return [null, answerCountError];
    }
    if (!answerCount.currentMaxAnswerCount) {
      answerCount.currentMaxAnswerCount = 1;
    } else {
      const [checkIsNewSurveyAnswer, checkIsNewSurveyAnswerError] =
        await this.customerPostPurchaseSurveyRepository.checkIsNewSurveyAnswer({
          orderNumber,
          currentMaxAnswerCount: answerCount.currentMaxAnswerCount,
        });
      if (checkIsNewSurveyAnswer.isNewSurveyAnswer) {
        answerCount.currentMaxAnswerCount += 1;
      }
    }

    const [postProductFeedbackRes, postProductFeedbackError] =
      await this.customerPostPurchaseSurveyRepository.postPostPurchaseSurveyCustomerAnswer(
        {
          id,
          customerId,
          orderNumber,
          responseId,
          productId,
          answer,
          title,
          content,
          reason,
          currentMaxAnswerCount: answerCount.currentMaxAnswerCount,
        },
      );
    return [{ id: postProductFeedbackRes.id }, null];
  }
}

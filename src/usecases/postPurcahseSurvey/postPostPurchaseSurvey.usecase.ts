import { Inject, Injectable } from '@nestjs/common';

import { PostPostPurchaseSurveyDto } from '@Controllers/discoveries/dtos/postPostPurchaseSurvey';
import { ShipheroRepoInterface } from '@Repositories/shiphero/shiphero.repository';
import { QuestionPostPurchaseSurveyRepoInterface } from '@Repositories/teatisDB/questionRepo/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepoInterface } from '@Repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';

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
    @Inject('ShipheroRepoInterface')
    private shipheroRepo: ShipheroRepoInterface,
    @Inject('QuestionPostPurchaseSurveyRepoInterface')
    private questionPostPurchaseSurveyRepo: QuestionPostPurchaseSurveyRepoInterface,
    @Inject('CustomerPostPurchaseSurveyRepoInterface')
    private customerpostPurchaseSurveyRepo: CustomerPostPurchaseSurveyRepoInterface,
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
    let [answerCountRes, answerCountError] =
      await this.customerpostPurchaseSurveyRepo.getAnswerCount({ customerId });
    if (answerCountError) {
      return [null, answerCountError];
    }
    if (!answerCountRes.currentMaxAnswerCount) {
      answerCountRes.currentMaxAnswerCount = 1;
    } else {
      const [checkIsNewSurveyAnswer, checkIsNewSurveyAnswerError] =
        await this.customerpostPurchaseSurveyRepo.checkIsNewSurveyAnswer({
          orderNumber,
          currentMaxAnswerCount: answerCountRes.currentMaxAnswerCount,
        });
      if (checkIsNewSurveyAnswer.isNewSurveyAnswer) {
        answerCountRes.currentMaxAnswerCount += 1;
      }
    }

    const [postProductFeedbackRes, postProductFeedbackError] =
      await this.customerpostPurchaseSurveyRepo.postPostPurchaseSurveyCustomerAnswer(
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
          currentMaxAnswerCount: answerCountRes.currentMaxAnswerCount,
        },
      );
    return [{ id: postProductFeedbackRes.id }, null];
  }
}

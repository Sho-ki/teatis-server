import { Inject, Injectable } from '@nestjs/common';

import { PostPostPurchaseSurveyDto } from '@Controllers/discoveries/dtos/postPostPurchaseSurvey';
import { CustomerPostPurchaseSurveyRepositoryInterface } from '@Repositories/teatisDB/customer/customerPostPurchaseSurvey.repository';
import { PostPurchaseSurveyAnswer } from '@Domains/PostPurchaseSurveyAnswer';
import { ReturnValueType } from '@Filters/customError';

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
  }: PostPostPurchaseSurveyDto): Promise<ReturnValueType<PostPurchaseSurveyAnswer>>;
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
    glucoseImpact,
  }: PostPostPurchaseSurveyDto): Promise<ReturnValueType<PostPurchaseSurveyAnswer>> {
    const [answerCount, answerCountError] =
      await this.customerPostPurchaseSurveyRepository.getAnswerCount({ customerId });
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
      if(checkIsNewSurveyAnswerError){
        return [undefined, checkIsNewSurveyAnswerError];
      }
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
          glucoseImpact,
          currentMaxAnswerCount: answerCount.currentMaxAnswerCount,
        },
      );
    if(postProductFeedbackError){
      return [undefined, postProductFeedbackError];
    }
    return [{ id: postProductFeedbackRes.id }, null];
  }
}

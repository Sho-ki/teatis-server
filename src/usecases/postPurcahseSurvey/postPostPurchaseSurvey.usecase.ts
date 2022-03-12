import { Inject, Injectable } from '@nestjs/common';

import { PostPostPurchaseSurveyDto } from 'src/controllers/discoveries/dtos/postPostPurchaseSurvey';
import { ShipheroRepoInterface } from 'src/repositories/shiphero/shiphero.repository';
import { QuestionPostPurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/questionRepo/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';

export interface PostPostPurchaseSurveyUsecaseInterface {
  postPostPurchaseSurvey({
    id,
    customerId,
    shopifyOrderNumber,
    productId,
    questionCategory,
    surveyQuestionAnswerType,
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
    shopifyOrderNumber,
    productId,
    questionCategory,
    surveyQuestionAnswerType,
    answer,
    title,
    content,
    reason,
  }: PostPostPurchaseSurveyDto): Promise<[PostPostPurchaseSurveyRes, Error]> {
    let [answerCount, answerCountError] =
      await this.customerpostPurchaseSurveyRepo.getAnswerCount({ customerId });
    if (!answerCount.currentMaxAnswerCount) {
      answerCount.currentMaxAnswerCount = 1;
    } else {
      let isNewSurveyAnswer =
        await this.customerpostPurchaseSurveyRepo.checkIsNewSurveyAnswer(
          shopifyOrderNumber,
          answerCount.currentMaxAnswerCount,
        );
      if (isNewSurveyAnswer) {
        answerCount.currentMaxAnswerCount += 1;
      }
    }

    if (questionCategory.name === 'productFeedback') {
      const [postProductFeedback, postProductFeedbackError] =
        await this.customerpostPurchaseSurveyRepo.postPostPurchaseSurveyCustomerAnswerProductFeedback(
          {
            id,
            customerId,
            shopifyOrderNumber,
            productId,
            answer,
            title,
            content,
            reason,
            currentMaxAnswerCount: answerCount.currentMaxAnswerCount,
          },
        );
      return [{ id: postProductFeedback.id }, null];
    }
  }
}

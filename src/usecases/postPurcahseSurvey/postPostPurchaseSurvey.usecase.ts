import { Inject, Injectable } from '@nestjs/common';

import { PostPostPurchaseSurveyDto } from 'src/controllers/discoveries/dtos/postPostPurchaseSurvey';
import { ShipheroRepoInterface } from 'src/repositories/shiphero/shiphero.repository';
import { QuestionPostPurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/questionRepo/questionPostPurchaseSurvey.repository';
import { CustomerPostPurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';

export interface PostPostPurchaseSurveyUsecaseInterface {
  postPostPurchaseSurvey({
    id,
    customerId,
    orderNumber,
    productId,
    questionCategory,
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
    questionCategory,
    answer,
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
      let isNewSurveyAnswer =
        await this.customerpostPurchaseSurveyRepo.checkIsNewSurveyAnswer(
          orderNumber,
          answerCountRes.currentMaxAnswerCount,
        );
      if (isNewSurveyAnswer) {
        answerCountRes.currentMaxAnswerCount += 1;
      }
    }

    if (questionCategory.name === 'productFeedback') {
      const [postProductFeedbackRes, postProductFeedbackError] =
        await this.customerpostPurchaseSurveyRepo.postPostPurchaseSurveyCustomerAnswerProductFeedback(
          {
            id,
            customerId,
            orderNumber,
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
}

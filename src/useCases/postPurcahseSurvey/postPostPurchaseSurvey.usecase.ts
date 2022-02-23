import { Inject, Injectable } from '@nestjs/common';

import { GetProductDetailQuery } from '../../repositories/shiphero/generated/graphql';
import { SurveyQuestionIds } from '../../domains/model/teatisDB/questionRepo/questionPostPurchaseSurvey';
import { PostPostPurchaseSurveyDto } from '../../controllers/discoveries/dtos/postPostPurchaseSurvey';
import { ShipheroRepoInterface } from '../../repositories/shiphero/shiphero.repository';
import { QuestionPostPurchaseSurveyRepoInterface } from '../../repositories/teatisDB/questionRepo/questionPostPurchaseSurvey.repository';
import {
  CustomerPostPurchaseSurveyRepoInterface,
  GetAnswerCountRes as TeatisDBGetAnswerCount,
} from '../../repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';

export interface PostPostPurchaseSurveyUseCaseInterface {
  postPostPurchaseSurvey({
    id,
    customerId,
    shopifyOrderNumber,
    productId,
    questionCategory,
    surveyQuestionAnswerType,
    answerBool,
    answerNumeric,
    answerOptions,
    answerSingleOptionId,
    answerText,
    title,
    content,
    reason,
  }: PostPostPurchaseSurveyDto): Promise<any>;
}

@Injectable()
export class PostPostPurchaseSurveyUseCase
  implements PostPostPurchaseSurveyUseCaseInterface
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
    answerBool,
    answerNumeric,
    answerOptions,
    answerSingleOptionId,
    answerText,
    title,
    content,
    reason,
  }: PostPostPurchaseSurveyDto): Promise<any> {
    let { currentMaxAnswerCount }: TeatisDBGetAnswerCount =
      await this.customerpostPurchaseSurveyRepo.getAnswerCount({ customerId });
    if (!currentMaxAnswerCount) {
      currentMaxAnswerCount = 1;
    } else {
      let isNewSurveyAnswer =
        await this.customerpostPurchaseSurveyRepo.checkIsNewSurveyAnswer(
          shopifyOrderNumber,
          currentMaxAnswerCount,
        );
      if (isNewSurveyAnswer) {
        currentMaxAnswerCount += 1;
      }
    }
    console.log('currentMaxAnswerCount', currentMaxAnswerCount);

    if (questionCategory === 'productFeedback') {
      await this.customerpostPurchaseSurveyRepo.postPostPurchaseSurveyCustomerAnswerProductFeedback(
        {
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
        },
      );
    }
    return;
  }
}
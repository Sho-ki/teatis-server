import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { SurveyQuestionsRepositoryInterface } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { SurveyName } from 'src/shared/constants/surveyName';
import { ActiveSurvey } from '../../domains/Survey';
import { GetProductOptionsUtilInterface } from '../utils/getProductOptions';

export interface GetPrePurchaseSurveyDriverUsecaseInterface {
  getPrePurchaseSurveyQuestionsDriver():
  Promise<ReturnValueType<ActiveSurvey>>;
}

@Injectable()
export class GetPrePurchaseSurveyDriverUsecase
implements GetPrePurchaseSurveyDriverUsecaseInterface
{
  constructor(
    @Inject('SurveyQuestionsRepositoryInterface')
    private readonly surveyQuestionsRepository: SurveyQuestionsRepositoryInterface,
    @Inject('GetProductOptionsUtilInterface')
    private readonly getProductOptionsUtil: GetProductOptionsUtilInterface,
  ) {}

  async getPrePurchaseSurveyQuestionsDriver():
   Promise<ReturnValueType<ActiveSurvey>> {
    const [survey, getSurveyQuestionsError] =
      await this.surveyQuestionsRepository.getSurveyQuestions(
        { surveyName: SurveyName.DriverPrePurchase });

    if (getSurveyQuestionsError) {
      return [undefined, getSurveyQuestionsError];
    }

    const [surveyWithProductOptions] = await this.getProductOptionsUtil.getProductOptions(survey);

    return [surveyWithProductOptions];
  }
}


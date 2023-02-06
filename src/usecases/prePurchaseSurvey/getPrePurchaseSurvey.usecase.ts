import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { SurveyQuestionsRepositoryInterface } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { SurveyName } from '@Usecases/utils/surveyName';
import { ActiveSurvey } from '../../domains/Survey';

export interface GetPrePurchaseSurveyUsecaseInterface {
  getPrePurchaseSurveyQuestions(): Promise<ReturnValueType<ActiveSurvey>>;
}

@Injectable()
export class GetPrePurchaseSurveyUsecase
implements GetPrePurchaseSurveyUsecaseInterface
{
  constructor(
    @Inject('SurveyQuestionsRepositoryInterface')
    private readonly surveyQuestionsRepository: SurveyQuestionsRepositoryInterface,
  ) {}
  async getPrePurchaseSurveyQuestions(): Promise<ReturnValueType<ActiveSurvey>> {
    const [getSurveyQuestions, getSurveyQuestionsError] =
        await this.surveyQuestionsRepository.getSurveyQuestions({ surveyName: SurveyName.PrePurchase });
    if (getSurveyQuestionsError) {
      return [undefined, getSurveyQuestionsError];
    }
    return [getSurveyQuestions];
  }
}

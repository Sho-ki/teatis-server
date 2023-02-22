import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { SurveyQuestionsRepositoryInterface } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { SurveyName } from '@Usecases/utils/surveyName';
import { ActiveSurvey } from '../../domains/Survey';

export interface GetWeeklyCheckInQuestionsUsecaseInterface {
  getWeeklyCheckInQuestions(): Promise<ReturnValueType<ActiveSurvey>>;
}

@Injectable()
export class GetWeeklyCheckInQuestionsUsecase
implements GetWeeklyCheckInQuestionsUsecaseInterface
{
  constructor(
    @Inject('SurveyQuestionsRepositoryInterface')
    private readonly surveyQuestionsRepository: SurveyQuestionsRepositoryInterface,
  ) {}

  async getWeeklyCheckInQuestions(): Promise<ReturnValueType<ActiveSurvey>> {
    const [getWeeklyCheckInQuestions, getWeeklyCheckInQuestionsError] =
        await this.surveyQuestionsRepository.getSurveyQuestions({ surveyName: SurveyName.WeeklyCheckIn });
    if (getWeeklyCheckInQuestionsError) {
      return [undefined, getWeeklyCheckInQuestionsError];
    }
    return [getWeeklyCheckInQuestions];
  }
}


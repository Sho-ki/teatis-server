import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { SurveyQuestionsRepositoryInterface } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { SurveyName } from '@Usecases/utils/surveyName';
import { ActiveSurvey } from '../../domains/Survey';
import { OneTimeCodeRepositoryInterface } from '../../repositories/teatisDB/oneTimeCode/oneTimeCode.repository';

export interface GetWeeklyCheckInQuestionsUsecaseInterface {
  getWeeklyCheckInQuestions(pointToken?:string): Promise<ReturnValueType<ActiveSurvey>>;
}

@Injectable()
export class GetWeeklyCheckInQuestionsUsecase
implements GetWeeklyCheckInQuestionsUsecaseInterface
{
  constructor(
    @Inject('SurveyQuestionsRepositoryInterface')
    private readonly surveyQuestionsRepository: SurveyQuestionsRepositoryInterface,
    @Inject('OneTimeCodeRepositoryInterface')
    private readonly oneTimeCodeRepository: OneTimeCodeRepositoryInterface,

  ) {}

  async getWeeklyCheckInQuestions(pointToken?:string): Promise<ReturnValueType<ActiveSurvey>> {

    const [getWeeklyCheckInQuestions, getWeeklyCheckInQuestionsError] =
        await this.surveyQuestionsRepository.getSurveyQuestions({ surveyName: SurveyName.WeeklyCheckIn });
    if (getWeeklyCheckInQuestionsError) {
      return [undefined, getWeeklyCheckInQuestionsError];
    }

    if(pointToken){
      const [oneTimeCode, getOneTimeCodeError] = await this.oneTimeCodeRepository.getOneTimeCode(pointToken);
      if (getOneTimeCodeError) return [undefined, getOneTimeCodeError];

      const isActive = oneTimeCode.status === 'active';
      const isValidDuration = oneTimeCode.validUntil > new Date();
      if(!isActive || !isValidDuration) return [undefined, { name: 'Invalid', message: 'PointToken is not active or expired' }];
    }

    return [{ ...getWeeklyCheckInQuestions, pointToken }];
  }
}


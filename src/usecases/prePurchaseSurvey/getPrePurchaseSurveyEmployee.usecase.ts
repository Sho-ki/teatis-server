import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { SurveyQuestionsRepositoryInterface } from '@Repositories/teatisDB/survey/surveyQuestions.repository';
import { SurveyName } from '@Usecases/utils/surveyName';
import { ActiveSurvey } from '../../domains/Survey';
import { EmployerRepositoryInterface } from '../../repositories/teatisDB/employer/employer.repository';
import { GetProductOptionsUtilInterface } from '../utils/getProductOptions';

 interface GetPrePurchaseSurveyEmployeeQuestionsEmployerArgs {
  employerUuid: string;
}
export interface GetPrePurchaseSurveyEmployeeUsecaseInterface {
  getPrePurchaseSurveyQuestionsEmployee({ employerUuid }:GetPrePurchaseSurveyEmployeeQuestionsEmployerArgs):
  Promise<ReturnValueType<ActiveSurvey>>;
}

@Injectable()
export class GetPrePurchaseSurveyEmployeeUsecase
implements GetPrePurchaseSurveyEmployeeUsecaseInterface
{
  constructor(
    @Inject('SurveyQuestionsRepositoryInterface')
    private readonly surveyQuestionsRepository: SurveyQuestionsRepositoryInterface,
    @Inject('EmployerRepositoryInterface')
    private readonly employerRepository: EmployerRepositoryInterface,
    @Inject('GetProductOptionsUtilInterface')
    private readonly getProductOptionsUtil: GetProductOptionsUtilInterface,
  ) {}

  async getPrePurchaseSurveyQuestionsEmployee({ employerUuid }:GetPrePurchaseSurveyEmployeeQuestionsEmployerArgs):
   Promise<ReturnValueType<ActiveSurvey>> {

    const [employer, employerNotFound] = await this.employerRepository.getEmployerByUuid({ uuid: employerUuid  });
    if(!employer) return [undefined, employerNotFound];

    const [survey, getSurveyQuestionsError] =
      await this.surveyQuestionsRepository.getSurveyQuestions(
        { surveyName: SurveyName.EmployeePrePurchase });

    if (getSurveyQuestionsError) {
      return [undefined, getSurveyQuestionsError];
    }

    const [surveyWithProductOptions] = await this.getProductOptionsUtil.getProductOptions(survey);

    return [surveyWithProductOptions];
  }
}


import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { GetTemporaryPrePurchaseSurveyDto } from '../../controllers/discoveries/dtos/GetTemporaryPrePurchaseSurvey';
import { TemporaryPrePurchaseSurveyRepositoryInterface } from '../../repositories/teatisDB/temporaryPrePurchaseSurvey/temporaryPrePurchaseSurvey.repository';
import { PrePurchaseSurveyAnswer } from '../../domains/PrePurchaseSurveyAnswer';

export interface GetTemporaryPrePurchaseSurveyUsecaseInterface {
  getTemporaryPrePurchaseSurvey({ answerIdentifier }: GetTemporaryPrePurchaseSurveyDto): Promise<
    ReturnValueType<PrePurchaseSurveyAnswer>
  >;
}

@Injectable()
export class GetTemporaryPrePurchaseSurveyUsecase
implements GetTemporaryPrePurchaseSurveyUsecaseInterface
{
  constructor(
    @Inject('TemporaryPrePurchaseSurveyRepositoryInterface')
    private readonly temporaryPrePurchaseSurveyRepository: TemporaryPrePurchaseSurveyRepositoryInterface,
  ) {}

  async getTemporaryPrePurchaseSurvey({ answerIdentifier }: GetTemporaryPrePurchaseSurveyDto):
  Promise<ReturnValueType<PrePurchaseSurveyAnswer>> {

    const [getTemporaryPrePurchaseSurvey, getTemporaryPrePurchaseSurveyError] =
    await this.temporaryPrePurchaseSurveyRepository.getTemporaryPrePurchaseSurvey(
      { answerIdentifier }
    );
    if(getTemporaryPrePurchaseSurveyError){
      return [undefined, getTemporaryPrePurchaseSurveyError];
    }
    return [getTemporaryPrePurchaseSurvey];
  }

}

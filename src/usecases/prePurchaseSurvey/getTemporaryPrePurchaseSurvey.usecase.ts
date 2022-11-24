import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { GetTemporaryPrePurchaseSurveyDto } from '@Controllers/discoveries/dtos/getTemporaryPrePurchaseSurvey';
import { TemporaryPrePurchaseSurveyRepositoryInterface } from '@Repositories/teatisDB/temporaryPrePurchaseSurvey/temporaryPrePurchaseSurvey.repository';
import { PrePurchaseSurveyAnswer } from '@Domains/PrePurchaseSurveyAnswer';

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

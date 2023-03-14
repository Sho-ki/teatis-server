import { Inject, Injectable } from '@nestjs/common';

import { ReturnValueType } from '@Filters/customError';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerSurveyResponseRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponse.repository';
import { CustomerSurveyHistoryRepositoryInterface } from '../../repositories/teatisDB/customer/customerSurveyResponseHistory.repository';
import { SurveyName } from '../utils/surveyName';
import { SurveyQuestionResponse } from '@prisma/client';
import { PostWeeklyCheckInDto } from '@Controllers/discoveries/weeklyCheckIn/dtos/postWeeklyCheckIn';
import { OneTimeCodeRepositoryInterface } from '../../repositories/teatisDB/oneTimeCode/oneTimeCode.repository';
import { TransactionOperatorInterface } from '../../repositories/utils/transactionOperator';
import { CustomerPointLogRepositoryInterface } from '../../repositories/teatisDB/customerPointLog/customerPointLog.repository';
import { getRewardEventPoint } from '../utils/teatisPointSet';

export interface PostWeeklyCheckInQuestionsUsecaseInterface {
    postWeeklyCheckInQuestions({ uuid, customerResponses, pointToken }: PostWeeklyCheckInDto): Promise<
    ReturnValueType<SurveyQuestionResponse[]>
  >;
}

@Injectable()
export class PostWeeklyCheckInQuestionsUsecase
implements PostWeeklyCheckInQuestionsUsecaseInterface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerSurveyResponseRepositoryInterface')
    private readonly customerSurveyResponseRepository: CustomerSurveyResponseRepositoryInterface,
    @Inject('CustomerSurveyHistoryRepositoryInterface')
    private readonly customerSurveyHistoryRepository: CustomerSurveyHistoryRepositoryInterface,
    @Inject('OneTimeCodeRepositoryInterface')
    private readonly oneTimeCodeRepository: OneTimeCodeRepositoryInterface,
    @Inject('CustomerPointLogRepositoryInterface')
    private readonly customerPointLogRepository: CustomerPointLogRepositoryInterface,

    @Inject('TransactionOperatorInterface')
    private readonly transactionOperator: TransactionOperatorInterface,
  ) {}
  async postWeeklyCheckInQuestions({ uuid, customerResponses, pointToken }: PostWeeklyCheckInDto): Promise<
    ReturnValueType<SurveyQuestionResponse[]>
  > {
    const [customerResponse, customerResponseError] = await this.transactionOperator
      .performAtomicOperations(
        [
          this.customerGeneralRepository,
          this.customerSurveyResponseRepository,
          this.customerSurveyHistoryRepository,
          this.oneTimeCodeRepository,
          this.customerPointLogRepository,
        ],
        async (): Promise<ReturnValueType<SurveyQuestionResponse[]>> => {
          const [customer, getCustomerError] =
        await this.customerGeneralRepository.getCustomerByUuid({ uuid });
          if(getCustomerError){
            return [undefined, getCustomerError];
          }

          const customerSurveyHistory = await this.customerSurveyHistoryRepository.createCustomerSurveyHistory(
            { customerId: customer.id, surveyName: SurveyName.WeeklyCheckIn  });

          const surveyQuestionResponses:SurveyQuestionResponse[]=[];
          for(const customerResponse of customerResponses){
            const response = await this.customerSurveyResponseRepository.upsertCustomerResponse(
              {
                surveyHistoryId: customerSurveyHistory.id,
                surveyQuestionResponseId: customerSurveyHistory?.surveyQuestionResponse?.find(({ surveyQuestionId }) =>
                { return surveyQuestionId === customerResponse.surveyQuestionId; })?.id,

                customerResponse: customerResponse.response,
                surveyQuestionId: customerResponse.surveyQuestionId,
              });
            surveyQuestionResponses.push(response);
          }

          if(pointToken){
            const [oneTimeCode, getOneTimeCodeError] = await this.oneTimeCodeRepository.getOneTimeCode(pointToken);
            if (getOneTimeCodeError) return [surveyQuestionResponses];
            const isActive = oneTimeCode.status === 'active';
            const isValidDuration = oneTimeCode.validUntil > new Date();
            if(!isActive || !isValidDuration) return [surveyQuestionResponses];

            const [type, points] = getRewardEventPoint('completeWeeklyCheckIn');
            await this.customerPointLogRepository.createCustomerPointLog({ customerId: customer.id, points, type });

            await this.oneTimeCodeRepository.deactivateOneTimeCode(pointToken);
          }
          return [surveyQuestionResponses];
        });

    if(customerResponseError) return [undefined, customerResponseError];
    return [customerResponse];
  }
}

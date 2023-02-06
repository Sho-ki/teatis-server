import { Inject, Injectable } from '@nestjs/common';

import { CustomerBoxType } from '../../domains/CustomerBoxType';
import { ReturnValueType } from '@Filters/customError';
import { PostPrePurchaseSurvey2Dto } from '@Controllers/discoveries/dtos/postPrePurchaseSurvey2';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerPrePurchaseSurveyHistoryRepositoryInterface } from '@Repositories/teatisDB/customer/customerSurveyResponseHistory.repository';

export interface PostPrePurchaseSurveyUsecase2Interface {
  postPrePurchaseSurvey({ surveyId, customerUuid, customerResponses }: PostPrePurchaseSurvey2Dto): Promise<
    ReturnValueType<CustomerBoxType>
  >;
}

@Injectable()
export class PostPrePurchaseSurveyUsecase2
implements PostPrePurchaseSurveyUsecase2Interface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerPrePurchaseSurveyHistoryRepositoryInterface')
    private readonly customerPrePurchaseSurveyHistoryRepository: CustomerPrePurchaseSurveyHistoryRepositoryInterface,
  ) {}
  async postPrePurchaseSurvey({ surveyId, customerUuid, customerResponses }: PostPrePurchaseSurvey2Dto): Promise<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReturnValueType<any>
  > {
    const [getCustomer, getCustomerError] =
        await this.customerGeneralRepository.getCustomerByUuid({ uuid: customerUuid });
    if(getCustomerError){
      return [undefined, getCustomerError];
    }
    const { id } = getCustomer;
    const [updateHistoryAndResponse, updateHistoryAndResponseError] =
        await this.customerPrePurchaseSurveyHistoryRepository.upsertCustomerSurveyResponseHistory({
          surveyId,
          customerId: id,
          customerResponses,
        });
    if(getCustomerError){
      return [undefined, updateHistoryAndResponseError];
    }
    return [updateHistoryAndResponse];
  }
}

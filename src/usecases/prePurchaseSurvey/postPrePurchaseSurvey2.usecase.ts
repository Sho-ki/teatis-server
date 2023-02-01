import { Inject, Injectable } from '@nestjs/common';

import { CustomerBoxType } from '../../domains/CustomerBoxType';
import { ReturnValueType } from '@Filters/customError';
import { PostPrePurchaseSurvey2Dto } from '@Controllers/discoveries/dtos/postPrePurchaseSurvey2';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { CustomerPostPurchaseSurveyHistoryRepositoryInterface } from '@Repositories/teatisDB/customer/customerSurveyResponseHistory.repository';

export interface postPrePurchaseSurveyUsecase2Interface {
  postPrePurchaseSurvey({ surveyId, customerUuid, surveyResponse }: PostPrePurchaseSurvey2Dto): Promise<
    ReturnValueType<CustomerBoxType>
  >;
}

@Injectable()
export class PostPrePurchaseSurveyUsecase2
implements postPrePurchaseSurveyUsecase2Interface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private readonly customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerPostPurchaseSurveyHistoryRepositoryInterface')
    private readonly customerPostPurchaseSurveyHistoryRepository: CustomerPostPurchaseSurveyHistoryRepositoryInterface,
  ) {}
  async postPrePurchaseSurvey({ surveyId, customerUuid }: PostPrePurchaseSurvey2Dto): Promise<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ReturnValueType<any>
  > {
    const [getCustomer, getCustomerError] =
        await this.customerGeneralRepository.getCustomerByUuid({ uuid: customerUuid });
    if(getCustomerError){
      return [undefined, getCustomerError];
    }
    const { id } = getCustomer;
    const updateHistory =
        await this.customerPostPurchaseSurveyHistoryRepository.upsertCustomerSurveyResponseHistory({
          surveyId,
          customerId: id,
        });
    return [updateHistory];
  }
}

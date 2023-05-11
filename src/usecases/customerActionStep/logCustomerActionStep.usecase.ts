import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { ReturnValueType } from '../../filter/customError';
import { CustomerActionStepRepositoryInterface } from '../../repositories/teatisDB/customerActionStep/customerActionStep.repository';
import { ActionStepSummaryDto } from '../../controllers/ResponseDtos/ActionStepSummary.dto';
import { LogCustomerActionStepRequestDto } from '../../controllers/customerMicroGoal/dtos/logCustomerActionStep.dto';

export interface LogCustomerActionStepUsecaseInterface {
  execute({ uuid, actionStepId, date }: LogCustomerActionStepRequestDto): Promise<
    ReturnValueType<ActionStepSummaryDto>
  >;
}

@Injectable()
export class LogCustomerActionStepUsecase
implements LogCustomerActionStepUsecaseInterface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerActionStepRepositoryInterface')
    private customerActionStepRepository: CustomerActionStepRepositoryInterface,

  ) {}

  async execute({ uuid, actionStepId, date }: LogCustomerActionStepRequestDto): Promise<
    ReturnValueType<ActionStepSummaryDto>> {
    const [, getCustomerError] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if (getCustomerError) return [undefined, getCustomerError];
    const [customerActionStep] =
    await this.customerActionStepRepository.logCustomerActionStep({ date, actionStepId });

    return [customerActionStep];

  }
}

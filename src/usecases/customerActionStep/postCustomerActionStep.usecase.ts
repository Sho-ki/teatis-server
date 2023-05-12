import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { ReturnValueType } from '../../filter/customError';
import { CustomerActionStepRepositoryInterface } from '../../repositories/teatisDB/customerActionStep/customerActionStep.repository';
import { ActionStepSummaryDto } from '../../controllers/ResponseDtos/ActionStepSummary.dto';
import { PostCustomerActionStepRequestDto } from '../../controllers/customerMicroGoal/dtos/postCustomerActionStep.dto';

export interface PostCustomerActionStepUsecaseInterface {
  execute({ uuid, actionStepId, date }: PostCustomerActionStepRequestDto): Promise<
    ReturnValueType<ActionStepSummaryDto>
  >;
}

@Injectable()
export class PostCustomerActionStepUsecase
implements PostCustomerActionStepUsecaseInterface
{
  constructor(
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
    @Inject('CustomerActionStepRepositoryInterface')
    private customerActionStepRepository: CustomerActionStepRepositoryInterface,

  ) {}

  async execute({ uuid, actionStepId, date }: PostCustomerActionStepRequestDto): Promise<
    ReturnValueType<ActionStepSummaryDto>> {
    const [, getCustomerError] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if (getCustomerError) return [undefined, getCustomerError];
    const [customerActionStep] =
    await this.customerActionStepRepository.postCustomerActionStep({ date, actionStepId });

    return [customerActionStep];

  }
}

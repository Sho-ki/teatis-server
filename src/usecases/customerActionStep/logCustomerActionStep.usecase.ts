import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { ReturnValueType } from '../../filter/customError';
import { LogCustomerActionStepRequestDto } from '../../controllers/microGoal/dtos/request/logCustomerActionStep.dto';
import { CustomerActionStepRepositoryInterface } from '../../repositories/teatisDB/customerActionStep/customerActionStep.repository';
import { LogCustomerActionStepResponseDto } from '../../controllers/microGoal/dtos/response/logCustomerActionStep.dto';

export interface LogCustomerActionStepUsecaseInterface {
  execute({ uuid, actionStepId, date }: LogCustomerActionStepRequestDto): Promise<
    ReturnValueType<LogCustomerActionStepResponseDto.Main>
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
    ReturnValueType<LogCustomerActionStepResponseDto.Main>> {
    const [customer, getCustomerError] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if (getCustomerError) return [undefined, getCustomerError];
    const [customerActionStep] =
    await this.customerActionStepRepository.logCustomerActionStep({ date, actionStepId });

    return [{ customerId: customer.id, id: customerActionStep.id, completedAt: customerActionStep.completedAt }];

  }
}

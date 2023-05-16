import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { ReturnValueType } from '../../filter/customError';
import { CustomerActionStepRepositoryInterface } from '../../repositories/teatisDB/customerActionStep/customerActionStep.repository';
import { PostCustomerActionStepRequestDto } from '../../controllers/customerMicroGoal/dtos/postCustomerActionStep.dto';
import { ActionStep, ActionStepImage, CustomerActionStep, CustomerActionStepImage } from '@prisma/client';
import { ActionStepDto } from '../../controllers/ResponseDtos/ActionStep.dto';

export interface PostCustomerActionStepUsecaseInterface {
  execute({ uuid, actionStepId, date }: PostCustomerActionStepRequestDto): Promise<
    ReturnValueType<ActionStepDto>
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

  private transformActionSteps(
    actionStep: (ActionStep & { actionStepImage?: ActionStepImage[]}),
    customerActionStep: (CustomerActionStep & {customerActionStepImage?: CustomerActionStepImage[]}))
    : ActionStepDto {
    const mainText = customerActionStep.customizedMainText || actionStep.mainText;
    const subText = customerActionStep.customizedSubText || actionStep.subText;

    actionStep.actionStepImage.forEach((actionStepImage) => {
      const casImage = customerActionStep.customerActionStepImage?.
        find((image) => image.position === actionStepImage.position);
      if (casImage) actionStepImage.src = casImage.src;
    });

    return {
      id: customerActionStep.id,
      order: actionStep.order,
      mainText,
      subText,
      reason: actionStep.reason,
      completedAt: customerActionStep.completedAt,
      imageUrl: actionStep.actionStepImage.length > 0 ? actionStep.actionStepImage[0].src : undefined,
    };

  }

  async execute({ uuid, actionStepId, date }: PostCustomerActionStepRequestDto): Promise<
    ReturnValueType<ActionStepDto>> {
    const [, getCustomerError] = await this.customerGeneralRepository.getCustomerByUuid({ uuid });
    if (getCustomerError) return [undefined, getCustomerError];
    const [customerActionStep] =
    await this.customerActionStepRepository.postCustomerActionStep({ date, actionStepId });

    return [this.transformActionSteps(customerActionStep.actionStep, customerActionStep.customerActionStep), undefined];

  }
}

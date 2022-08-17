import { Inject, Injectable } from '@nestjs/common';

import { CreatePractitionerBoxDto } from '@Controllers/discoveries/dtos/createPractitionerBox';
import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { ReturnValueType } from '@Filters/customError';
import { PractitionerBox } from '@Domains/PractitionerBox';

export interface GetRecurringPractitionerBoxUsecaseInterface {
  getRecurringPractitionerBox(
    practitionerId: CreatePractitionerBoxDto['practitionerId'],
    label: CreatePractitionerBoxDto['label'],
  ): Promise<ReturnValueType<PractitionerBox>>;
}

@Injectable()
export class GetRecurringPractitionerBoxUsecase
implements GetRecurringPractitionerBoxUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxRepositoryInterface')
    private practitionerBoxRepository: PractitionerBoxRepositoryInterface,
  ) {}
  async getRecurringPractitionerBox(
    practitionerId: CreatePractitionerBoxDto['practitionerId'],
    label: CreatePractitionerBoxDto['label'],
  ): Promise<ReturnValueType<PractitionerBox>> {

    const [recurringPractitionerBox, recurringPractitionerBoxError] =
      await this.practitionerBoxRepository.getPractitionerRecurringBox({
        practitionerId,
        label,
      });
    if(recurringPractitionerBoxError){
      return [undefined, recurringPractitionerBoxError];
    }
    return [recurringPractitionerBox];
  }
}

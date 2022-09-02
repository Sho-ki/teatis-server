import { Inject, Injectable } from '@nestjs/common';

import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { ReturnValueType } from '@Filters/customError';
import { PractitionerBox } from '@Domains/PractitionerBox';

export interface GetAllRecurringPractitionerBoxesUsecaseInterface {
  getAllRecurringPractitionerBoxes(label: string): Promise<ReturnValueType<PractitionerBox[]>>;
}

@Injectable()
export class GetAllRecurringPractitionerBoxesUsecase
implements GetAllRecurringPractitionerBoxesUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxRepositoryInterface')
    private practitionerBoxRepository: PractitionerBoxRepositoryInterface,
  ) {}
  async getAllRecurringPractitionerBoxes(label:string): Promise<ReturnValueType<PractitionerBox[]>> {

    const [recurringPractitionerBoxes, recurringPractitionerBoxError] =
      await this.practitionerBoxRepository.getAllRecurringBox(label);
    if(recurringPractitionerBoxError){
      return [undefined, recurringPractitionerBoxError];
    }
    return [recurringPractitionerBoxes, undefined];
  }
}

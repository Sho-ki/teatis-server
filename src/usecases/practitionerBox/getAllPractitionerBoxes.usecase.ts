import { Inject, Injectable } from '@nestjs/common';

import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { ReturnValueType } from '@Filters/customError';
import { PractitionerBox } from '@Domains/PractitionerBox';

export interface GetAllPractitionerBoxesUsecaseInterface {
  getAllPractitionerBoxes(): Promise<ReturnValueType<PractitionerBox[]>>;
}

@Injectable()
export class GetAllPractitionerBoxesUsecase
implements GetAllPractitionerBoxesUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxRepositoryInterface')
    private practitionerBoxRepository: PractitionerBoxRepositoryInterface,
  ) {}
  async getAllPractitionerBoxes(): Promise<ReturnValueType<PractitionerBox[]>> {

    const [practitionerBoxes, practitionerBoxError] =
      await this.practitionerBoxRepository.getAllPractitionerBoxes();
    if(practitionerBoxError){
      return [undefined, practitionerBoxError];
    }
    return [practitionerBoxes, undefined];
  }
}

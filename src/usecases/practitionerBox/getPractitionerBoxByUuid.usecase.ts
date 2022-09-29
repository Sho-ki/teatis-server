import { Inject, Injectable } from '@nestjs/common';

import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { GetPractitionerBoxDto } from '@Controllers/discoveries/dtos/getPractitionerBox';
import { ReturnValueType } from '@Filters/customError';

export interface GetPractitionerBoxByUuidUsecaseInterface {
  getPractitionerBoxByUuid({ practitionerBoxUuid }: GetPractitionerBoxDto):
  Promise<ReturnValueType<PractitionerAndBox>>;
}

@Injectable()
export class GetPractitionerBoxByUuidUsecase
implements GetPractitionerBoxByUuidUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxRepositoryInterface')
    private practitionerBoxRepository: PractitionerBoxRepositoryInterface,
  ) {}
  async getPractitionerBoxByUuid({ practitionerBoxUuid }: GetPractitionerBoxDto):
  Promise<ReturnValueType<PractitionerAndBox>> {
    const [practitionerAndBox, getPractitionerAndBoxError] =
      await this.practitionerBoxRepository.getPractitionerAndBoxByUuid({ practitionerBoxUuid });
    if (getPractitionerAndBoxError) {
      return [undefined, getPractitionerAndBoxError];
    }
    if(new Date() >= new Date('2022-10-01')){
      practitionerAndBox.box.products = practitionerAndBox.box.products.slice(0, 8);
    }
    return [practitionerAndBox];
  }
}

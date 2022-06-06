import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from '@Repositories/teatisDB/customerRepo/customerBox.repository';
import { Status } from '@Domains/Status';
import { UpdateCustomerBoxDto } from '@Controllers/discoveries/dtos/updateCustomerBox';
import { PractitionerBoxRepoInterface } from '../../repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { PractitionerSingleBox } from '../../domains/PractitionerSingleBox';
import { GetPractitionerBoxDto } from '../../controllers/discoveries/dtos/getPractitionerBox';

export interface GetPractitionerBoxByUuidUsecaseInterface {
  getPractitionerBoxByUuid({
    practitionerBoxUuid,
  }: GetPractitionerBoxDto): Promise<[PractitionerSingleBox?, Error?]>;
}

@Injectable()
export class GetPractitionerBoxByUuidUsecase
  implements GetPractitionerBoxByUuidUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxRepoInterface')
    private practitionerBoxRepo: PractitionerBoxRepoInterface,
  ) {}
  async getPractitionerBoxByUuid({
    practitionerBoxUuid,
  }: GetPractitionerBoxDto): Promise<[PractitionerSingleBox?, Error?]> {
    try {
      const [practitionerSingleBox, getPractitionerSingleBoxError] =
        await this.practitionerBoxRepo.getPractitionerSingleBoxByUuid({
          practitionerBoxUuid,
        });
      if (getPractitionerSingleBoxError) {
        return [undefined, getPractitionerSingleBoxError];
      }
      return [practitionerSingleBox];
    } catch (e) {
      return [undefined, e];
    }
  }
}

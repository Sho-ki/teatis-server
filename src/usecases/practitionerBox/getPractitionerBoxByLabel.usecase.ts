import { Inject, Injectable } from '@nestjs/common';

import { PractitionerBoxRepoInterface } from '../../repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { PractitionerSingleBox } from '../../domains/PractitionerSingleBox';
import { PractitionerGeneralRepoInterface } from '../../repositories/teatisDB/practitionerRepo/practitionerGeneral.repository';
import { GetPractitionerBoxDto } from '../../controllers/discoveries/dtos/getPractitionerBox';

export interface GetPractitionerBoxByLabelUsecaseInterface {
  getPractitionerBoxByLabel({
    email,
    label,
  }: GetPractitionerBoxDto): Promise<[PractitionerSingleBox?, Error?]>;
}

@Injectable()
export class GetPractitionerBoxByLabelUsecase
  implements GetPractitionerBoxByLabelUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxRepoInterface')
    private practitionerBoxRepo: PractitionerBoxRepoInterface,
    @Inject('PractitionerGeneralRepoInterface')
    private practitionerGeneralRepo: PractitionerGeneralRepoInterface,
  ) {}
  async getPractitionerBoxByLabel({
    email,
    label,
  }: GetPractitionerBoxDto): Promise<[PractitionerSingleBox?, Error?]> {
    try {
      const [practitioner, getPractitionerError] =
        await this.practitionerGeneralRepo.getPractitioner({
          email,
        });
      if (getPractitionerError) {
        return [undefined, getPractitionerError];
      }
      const [practitionerSingleBox, getPractitionerSingleBoxError] =
        await this.practitionerBoxRepo.getPractitionerSingleBoxByLabel({
          label,
          practitionerId: practitioner.id,
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

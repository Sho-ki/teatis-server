import { Inject, Injectable } from '@nestjs/common';

import { PractitionerBoxRepoInterface } from '@Repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { PractitionerGeneralRepoInterface } from '@Repositories/teatisDB/practitionerRepo/practitionerGeneral.repository';
import { GetPractitionerBoxDto } from '@Controllers/discoveries/dtos/getPractitionerBox';

export interface GetPractitionerBoxByLabelUsecaseInterface {
  getPractitionerBoxByLabel({
    email,
    label,
  }: GetPractitionerBoxDto): Promise<[PractitionerAndBox?, Error?]>;
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
  }: GetPractitionerBoxDto): Promise<[PractitionerAndBox?, Error?]> {
    try {
      const [practitioner, getPractitionerError] =
        await this.practitionerGeneralRepo.getPractitioner({
          email,
        });
      if (getPractitionerError) {
        return [undefined, getPractitionerError];
      }
      const [practitionerAndBox, getPractitionerAndBoxError] =
        await this.practitionerBoxRepo.getPractitionerAndBoxByLabel({
          label,
          practitionerId: practitioner.id,
        });
      if (getPractitionerAndBoxError) {
        return [undefined, getPractitionerAndBoxError];
      }
      return [practitionerAndBox];
    } catch (e) {
      return [undefined, e];
    }
  }
}

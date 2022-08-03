import { Inject, Injectable } from '@nestjs/common';

import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { PractitionerGeneralRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerGeneral.repository';
import { GetPractitionerBoxDto } from '@Controllers/discoveries/dtos/getPractitionerBox';
import { ReturnValueType } from '@Filters/customError';

export interface GetPractitionerBoxByLabelUsecaseInterface {
  getPractitionerBoxByLabel({
    email,
    label,
  }: GetPractitionerBoxDto): Promise<ReturnValueType<PractitionerAndBox>>;
}

@Injectable()
export class GetPractitionerBoxByLabelUsecase
implements GetPractitionerBoxByLabelUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxRepositoryInterface')
    private practitionerBoxRepository: PractitionerBoxRepositoryInterface,
    @Inject('PractitionerGeneralRepositoryInterface')
    private practitionerGeneralRepository: PractitionerGeneralRepositoryInterface,
  ) {}
  async getPractitionerBoxByLabel({
    email,
    label,
  }: GetPractitionerBoxDto): Promise<ReturnValueType<PractitionerAndBox>> {
    const [practitioner, getPractitionerError] =
      await this.practitionerGeneralRepository.getPractitioner({ email });
    if (getPractitionerError) {
      return [undefined, getPractitionerError];
    }
    const [practitionerAndBox, getPractitionerAndBoxError] =
      await this.practitionerBoxRepository.getPractitionerAndBoxByLabel({
        label,
        practitionerId: practitioner.id,
      });
    if (getPractitionerAndBoxError) {
      return [undefined, getPractitionerAndBoxError];
    }
    return [practitionerAndBox];
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { PractitionerBoxRepoInterface } from '@Repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { PractitionerSingleBox } from '@Domains/PractitionerSingleBox';
import { GetPractitionerBoxDto } from '@Controllers/discoveries/dtos/getPractitionerBox';

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

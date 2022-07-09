import { Inject, Injectable } from '@nestjs/common';

import { PractitionerBoxRepoInterface } from '@Repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { GetPractitionerBoxDto } from '@Controllers/discoveries/dtos/getPractitionerBox';

export interface GetPractitionerBoxByUuidUsecaseInterface {
  getPractitionerBoxByUuid({
    practitionerBoxUuid,
  }: GetPractitionerBoxDto): Promise<[PractitionerAndBox?, Error?]>;
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
  }: GetPractitionerBoxDto): Promise<[PractitionerAndBox?, Error?]> {
    try {
      const [practitionerAndBox, getPractitionerAndBoxError] =
        await this.practitionerBoxRepo.getPractitionerAndBoxByUuid({
          practitionerBoxUuid,
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

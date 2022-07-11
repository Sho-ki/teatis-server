import { Inject, Injectable } from '@nestjs/common';

import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
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
    @Inject('PractitionerBoxRepositoryInterface')
    private practitionerBoxRepository: PractitionerBoxRepositoryInterface,
  ) {}
  async getPractitionerBoxByUuid({
    practitionerBoxUuid,
  }: GetPractitionerBoxDto): Promise<[PractitionerAndBox?, Error?]> {
    try {
      const [practitionerAndBox, getPractitionerAndBoxError] =
        await this.practitionerBoxRepository.getPractitionerAndBoxByUuid({
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

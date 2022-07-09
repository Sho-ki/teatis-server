import { Inject, Injectable } from '@nestjs/common';

import { CreatePractitionerBoxDto } from '@Controllers/discoveries/dtos/createPractitionerBox';
import { v4 as uuidv4 } from 'uuid';
import { PractitionerBoxRepoInterface } from '@Repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';

export interface CreatePractitionerBoxUsecaseInterface {
  createPractitionerBox({
    practitionerId,
    products,
    label,
    description,
    note,
  }: CreatePractitionerBoxDto): Promise<[PractitionerAndBox?, Error?]>;
}

@Injectable()
export class CreatePractitionerBoxUsecase
  implements CreatePractitionerBoxUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxRepoInterface')
    private practitionerBoxRepo: PractitionerBoxRepoInterface,
  ) {}
  async createPractitionerBox({
    practitionerId,
    products,
    label,
    description,
    note,
  }: CreatePractitionerBoxDto): Promise<[PractitionerAndBox?, Error?]> {
    try {
      const practitionerBoxUuid = uuidv4();

      const [practitionerBoxProduct, createPractitionerBoxProductError] =
        await this.practitionerBoxRepo.createPractitionerAndBox({
          practitionerId,
          practitionerBoxUuid,
          label,
          products,
          description,
          note,
        });
      if (createPractitionerBoxProductError) {
        throw new Error();
      }
      return [practitionerBoxProduct];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: createPractitionerBox Usecase failed',
        },
      ];
    }
  }
}

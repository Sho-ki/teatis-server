import { Inject, Injectable } from '@nestjs/common';

import { CreatePractitionerBoxDto } from '@Controllers/discoveries/dtos/createPractitionerBox';
import { v4 as uuidv4 } from 'uuid';
import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repo';
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
    @Inject('PractitionerBoxRepositoryInterface')
    private practitionerBoxRepository: PractitionerBoxRepositoryInterface,
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
        await this.practitionerBoxRepository.createPractitionerAndBox({
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

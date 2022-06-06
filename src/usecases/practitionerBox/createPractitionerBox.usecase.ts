import { Inject, Injectable } from '@nestjs/common';

import { CreatePractitionerBoxDto } from '../../controllers/discoveries/dtos/createPractitionerBox';
import { v4 as uuidv4 } from 'uuid';
import { PractitionerBoxRepoInterface } from '../../repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { PractitionerSingleBox } from '../../domains/PractitionerSingleBox';
// import { PractitionerBoxProduct } from '../../domains/PractitionerBoxProduct';

export interface CreatePractitionerBoxUsecaseInterface {
  createPractitionerBox({
    practitionerId,
    products,
    label,
    note,
  }: CreatePractitionerBoxDto): Promise<[PractitionerSingleBox?, Error?]>;
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
    note,
  }: CreatePractitionerBoxDto): Promise<[PractitionerSingleBox?, Error?]> {
    try {
      const practitionerBoxUuid = uuidv4();

      const [practitionerBoxProduct, createPractitionerBoxProductError] =
        await this.practitionerBoxRepo.createPractitionerSingleBox({
          practitionerId,
          practitionerBoxUuid,
          label,
          products,
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

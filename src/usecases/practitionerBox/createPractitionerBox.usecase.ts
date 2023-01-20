import { Inject, Injectable } from '@nestjs/common';

import { CreatePractitionerBoxDto } from '@Controllers/discoveries/dtos/createPractitionerBox';
import { v4 as uuidv4 } from 'uuid';
import { PractitionerBoxRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerBox.repository';
import { PractitionerAndBox } from '@Domains/PractitionerAndBox';
import { ReturnValueType } from '@Filters/customError';

export interface CreatePractitionerBoxUsecaseInterface {
  createPractitionerBox({
    practitionerId,
    products,
    label,
    description,
    note,
  }: CreatePractitionerBoxDto): Promise<ReturnValueType<PractitionerAndBox>>;
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
  }: CreatePractitionerBoxDto): Promise<ReturnValueType<PractitionerAndBox>> {
    const practitionerBoxUuid = uuidv4();

    const [practitionerBoxProduct, createPractitionerBoxProductError] =
      await this.practitionerBoxRepository.upsertPractitionerAndPractitionerBox({
        practitionerId,
        practitionerBoxUuid,
        label,
        products,
        description,
        note,
      });
    if(createPractitionerBoxProductError){
      return [undefined, createPractitionerBoxProductError];
    }
    return [practitionerBoxProduct];
  }
}

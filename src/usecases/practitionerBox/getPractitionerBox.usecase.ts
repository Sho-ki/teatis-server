import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from '@Repositories/teatisDB/customerRepo/customerBox.repository';
import { Status } from '@Domains/Status';
import { UpdateCustomerBoxDto } from '@Controllers/discoveries/dtos/updateCustomerBox';
import { GetPractitionerBoxDto } from '@Controllers/discoveries/dtos/getPractitionerBox';
import { PractitionerBoxRepoInterface } from '../../repositories/teatisDB/practitionerRepo/practitionerBox.repo';
import { PractitionerSocialMediaBoxDisplayProduct } from '../../domains/PractitionerSocialMediaBoxDisplayProduct';

export interface GetPractitionerBoxUsecaseInterface {
  getPractitionerBox({
    practitionerBoxUuid,
  }: GetPractitionerBoxDto): Promise<
    [PractitionerSocialMediaBoxDisplayProduct?, Error?]
  >;
}

@Injectable()
export class GetPractitionerBoxUsecase
  implements GetPractitionerBoxUsecaseInterface
{
  constructor(
    @Inject('PractitionerBoxRepoInterface')
    private practitionerBoxRepo: PractitionerBoxRepoInterface,
  ) {}
  async getPractitionerBox({
    practitionerBoxUuid,
  }: GetPractitionerBoxDto): Promise<
    [PractitionerSocialMediaBoxDisplayProduct?, Error?]
  > {
    try {
      const [practitionerBoxProduct, getpractitionerBoxProductError] =
        await this.practitionerBoxRepo.getPractitionerBoxProduct({
          practitionerBoxUuid,
        });
      if (getpractitionerBoxProductError) {
        return [undefined, getpractitionerBoxProductError];
      }
      return [practitionerBoxProduct];
    } catch (e) {
      return [undefined, e];
    }
  }
}

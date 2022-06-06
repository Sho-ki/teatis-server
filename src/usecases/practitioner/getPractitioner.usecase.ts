import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from '@Repositories/teatisDB/customerRepo/customerBox.repository';
import { Status } from '@Domains/Status';
import { UpdateCustomerBoxDto } from '@Controllers/discoveries/dtos/updateCustomerBox';
import { GetPractitionerDto } from '../../controllers/discoveries/dtos/getPractitioner';
import { v4 as uuidv4 } from 'uuid';
import { PractitionerGeneralRepoInterface } from '../../repositories/teatisDB/practitionerRepo/practitionerGeneral.repository';
import { Practitioner } from '../../domains/Practitioner';

export interface GetPractitionerUsecaseInterface {
  getPractitioner({
    email,
  }: GetPractitionerDto): Promise<[Practitioner?, Error?]>;
}

@Injectable()
export class GetPractitionerUsecase implements GetPractitionerUsecaseInterface {
  constructor(
    @Inject('PractitionerGeneralRepoInterface')
    private practitionerGeneralRepo: PractitionerGeneralRepoInterface,
  ) {}
  async getPractitioner({
    email,
  }: GetPractitionerDto): Promise<[Practitioner?, Error?]> {
    try {
      const [practitionerSocialMedia, getPractitionerError] =
        await this.practitionerGeneralRepo.getPractitioner({
          email,
        });
      if (getPractitionerError) {
        throw new Error();
      }
      return [
        {
          firstName: practitionerSocialMedia.firstName,
          lastName: practitionerSocialMedia.lastName,
          middleName: practitionerSocialMedia.middleName,
          message: practitionerSocialMedia.message,
          profileImage: practitionerSocialMedia.profileImage,
          email: practitionerSocialMedia.email,
          instagram: practitionerSocialMedia.instagram,
          facebook: practitionerSocialMedia.facebook,
          twitter: practitionerSocialMedia.twitter,
          website: practitionerSocialMedia.website,
          uuid: practitionerSocialMedia.uuid,
          id: practitionerSocialMedia.id,
        },
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getPractitioner Usecase failed',
        },
      ];
    }
  }
}

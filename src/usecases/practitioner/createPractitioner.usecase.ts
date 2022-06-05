import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CustomerBoxRepoInterface } from '@Repositories/teatisDB/customerRepo/customerBox.repository';
import { Status } from '@Domains/Status';
import { UpdateCustomerBoxDto } from '@Controllers/discoveries/dtos/updateCustomerBox';
import { CreatePractitionerDto } from '../../controllers/discoveries/dtos/createPractitioner';
import { v4 as uuidv4 } from 'uuid';
import { PractitionerGeneralRepoInterface } from '../../repositories/teatisDB/practitionerRepo/practitionerGeneral.repository';
import { PractitionerSocialMedia } from '../../domains/PractitionerSocialMedia';

export interface CreatePractitionerUsecaseInterface {
  createPractitioner({
    firstName,
    lastName,
    profileImage,
    email,
    instagram,
    facebook,
    twitter,
    website,
  }: CreatePractitionerDto): Promise<[PractitionerSocialMedia?, Error?]>;
}

@Injectable()
export class CreatePractitionerUsecase
  implements CreatePractitionerUsecaseInterface
{
  constructor(
    @Inject('PractitionerGeneralRepoInterface')
    private practitionerGeneralRepo: PractitionerGeneralRepoInterface,
  ) {}
  async createPractitioner({
    firstName,
    lastName,
    profileImage,
    email,
    instagram,
    facebook,
    twitter,
    website,
  }: CreatePractitionerDto): Promise<[PractitionerSocialMedia?, Error?]> {
    try {
      const uuid = uuidv4();

      const [practitionerSocialMedia, createPractitionerSocialMediaError] =
        await this.practitionerGeneralRepo.createPractitionerSocialMedia({
          firstName,
          lastName,
          profileImage,
          email,
          instagram,
          facebook,
          twitter,
          website,
          uuid,
        });
      if (createPractitionerSocialMediaError) {
        throw new Error();
      }
      return [
        {
          firstName: practitionerSocialMedia.firstName,
          lastName: practitionerSocialMedia.lastName,
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
          message: 'Server Side Error: createPractitioner Usecase failed',
        },
      ];
    }
  }
}

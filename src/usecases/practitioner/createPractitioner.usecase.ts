import { Inject, Injectable } from '@nestjs/common';

import { CreatePractitionerDto } from '@Controllers/discoveries/dtos/createPractitioner';
import { v4 as uuidv4 } from 'uuid';
import { PractitionerGeneralRepoInterface } from '@Repositories/teatisDB/practitionerRepo/practitionerGeneral.repository';
import { Practitioner } from '@Domains/Practitioner';

export interface CreatePractitionerUsecaseInterface {
  createPractitioner({
    firstName,
    lastName,
    message,
    middleName,
    profileImage,
    email,
    instagram,
    facebook,
    twitter,
    website,
  }: CreatePractitionerDto): Promise<[Practitioner?, Error?]>;
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
    message,
    middleName,
    profileImage,
    email,
    instagram,
    facebook,
    twitter,
    website,
  }: CreatePractitionerDto): Promise<[Practitioner?, Error?]> {
    try {
      const uuid = uuidv4();

      const [practitionerSocialMedia, createPractitionerError] =
        await this.practitionerGeneralRepo.createPractitioner({
          firstName,
          lastName,
          message,
          middleName,
          profileImage,
          email,
          instagram,
          facebook,
          twitter,
          website,
          uuid,
        });
      if (createPractitionerError) {
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
          message: 'Server Side Error: createPractitioner Usecase failed',
        },
      ];
    }
  }
}
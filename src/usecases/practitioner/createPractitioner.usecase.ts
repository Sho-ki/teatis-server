import { Inject, Injectable } from '@nestjs/common';

import { CreatePractitionerDto } from '@Controllers/discoveries/dtos/createPractitioner';
import { v4 as uuidv4 } from 'uuid';
import { PractitionerGeneralRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerGeneral.repository';
import { Practitioner } from '@Domains/Practitioner';
import { ReturnValueType } from '../../filter/customError';

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
  }: CreatePractitionerDto): Promise<ReturnValueType<Practitioner>>;
}

@Injectable()
export class CreatePractitionerUsecase
  implements CreatePractitionerUsecaseInterface
{
  constructor(
    @Inject('PractitionerGeneralRepositoryInterface')
    private practitionerGeneralRepository: PractitionerGeneralRepositoryInterface,
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
  }: CreatePractitionerDto): Promise<ReturnValueType<Practitioner>> {
    const uuid = uuidv4();

    const [practitionerSocialMedia, createPractitionerError] =
      await this.practitionerGeneralRepository.createPractitioner({
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
  }
}

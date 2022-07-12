import { Inject, Injectable } from '@nestjs/common';

import { GetPractitionerDto } from '@Controllers/discoveries/dtos/getPractitioner';
import { PractitionerGeneralRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerGeneral.repository';
import { Practitioner } from '@Domains/Practitioner';

export interface GetPractitionerUsecaseInterface {
  getPractitioner({
    email,
  }: GetPractitionerDto): Promise<[Practitioner?, Error?]>;
}

@Injectable()
export class GetPractitionerUsecase implements GetPractitionerUsecaseInterface {
  constructor(
    @Inject('PractitionerGeneralRepositoryInterface')
    private practitionerGeneralRepository: PractitionerGeneralRepositoryInterface,
  ) {}
  async getPractitioner({
    email,
  }: GetPractitionerDto): Promise<[Practitioner?, Error?]> {
    const [practitionerSocialMedia, getPractitionerError] =
      await this.practitionerGeneralRepository.getPractitioner({
        email,
      });
    if (getPractitionerError) {
      return [undefined, getPractitionerError];
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
  }
}

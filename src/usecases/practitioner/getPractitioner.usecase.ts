import { Inject, Injectable } from '@nestjs/common';

import { GetPractitionerDto } from '@Controllers/discoveries/practitioner/dtos/getPractitioner';
import { PractitionerGeneralRepositoryInterface } from '@Repositories/teatisDB/practitioner/practitionerGeneral.repository';
import { Practitioner } from '@Domains/Practitioner';
import { ReturnValueType } from '@Filters/customError';

export interface GetPractitionerUsecaseInterface {
  getPractitioner({ email }: GetPractitionerDto): Promise<ReturnValueType<Practitioner>>;
}

@Injectable()
export class GetPractitionerUsecase implements GetPractitionerUsecaseInterface {
  constructor(
    @Inject('PractitionerGeneralRepositoryInterface')
    private practitionerGeneralRepository: PractitionerGeneralRepositoryInterface,
  ) {}
  async getPractitioner({ email }: GetPractitionerDto): Promise<ReturnValueType<Practitioner>> {
    const [practitionerSocialMedia, getPractitionerError] =
      await this.practitionerGeneralRepository.getPractitioner({ email });
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

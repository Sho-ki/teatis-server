import { Injectable } from '@nestjs/common';
import { Practitioner } from '@Domains/Practitioner';

import { PrismaService } from '../../../prisma.service';
import { PractitionerSocialMedia } from '../../../domains/PractitionerSocialMedia';

interface createPractitionerSocialMediaArgs {
  firstName: string;
  lastName?: string;
  profileImage?: string;
  email: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
  uuid: string;
}

export interface PractitionerGeneralRepoInterface {
  createPractitionerSocialMedia({
    firstName,
    lastName,
    profileImage,
    email,
    instagram,
    facebook,
    twitter,
    website,
    uuid,
  }: createPractitionerSocialMediaArgs): Promise<
    [PractitionerSocialMedia?, Error?]
  >;
}

@Injectable()
export class PractitionerGeneralRepo
  implements PractitionerGeneralRepoInterface
{
  constructor(private prisma: PrismaService) {}

  async createPractitionerSocialMedia({
    firstName,
    lastName,
    profileImage,
    email,
    instagram,
    facebook,
    twitter,
    website,
    uuid,
  }: createPractitionerSocialMediaArgs): Promise<
    [PractitionerSocialMedia?, Error?]
  > {
    try {
      const response = await this.prisma.practitioner.upsert({
        where: { email },
        create: {
          firstName,
          lastName,
          profileImage,
          email,
          uuid,
          practitionerSocialMedia: {
            create: {
              instagram,
              facebook,
              twitter,
              website,
            },
          },
        },
        update: {
          firstName,
          lastName,
          profileImage,
          practitionerSocialMedia: {
            upsert: {
              create: {
                instagram,
                facebook,
                twitter,
                website,
              },
              update: {
                instagram,
                facebook,
                twitter,
                website,
              },
            },
          },
        },
        select: {
          practitionerSocialMedia: true,
          email: true,
          id: true,
          uuid: true,
          firstName: true,
          profileImage: true,
        },
      });

      if (
        !response.email ||
        !response?.id ||
        !response.uuid ||
        !response?.firstName
      ) {
        throw new Error();
      }
      return [
        {
          id: response.id,
          email: response.email,
          uuid: response.uuid,
          firstName: response.firstName,
          profileImage: response?.profileImage,
          instagram: response?.practitionerSocialMedia?.instagram,
          facebook: response?.practitionerSocialMedia?.facebook,
          twitter: response?.practitionerSocialMedia?.twitter,
          website: response?.practitionerSocialMedia?.website,
        },
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: createPractitioner failed',
        },
      ];
    }
  }
}

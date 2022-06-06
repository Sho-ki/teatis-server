import { Injectable } from '@nestjs/common';
import { Practitioner } from '@Domains/Practitioner';

import { PrismaService } from '../../../prisma.service';

interface createPractitionerArgs {
  firstName: string;
  lastName?: string;
  message?: string;
  middleName: string;
  profileImage?: string;
  email: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
  uuid: string;
}

interface getPractitionerArgs {
  email: string;
}

interface getPractitionerByPractitionerBoxArgs {
  practitionerBoxUuid: string;
}

export interface PractitionerGeneralRepoInterface {
  getPractitioner({
    email,
  }: getPractitionerArgs): Promise<[Practitioner?, Error?]>;
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
    uuid,
  }: createPractitionerArgs): Promise<[Practitioner?, Error?]>;
}

@Injectable()
export class PractitionerGeneralRepo
  implements PractitionerGeneralRepoInterface
{
  constructor(private prisma: PrismaService) {}
  async getPractitioner({
    email,
  }: getPractitionerArgs): Promise<[Practitioner?, Error?]> {
    try {
      const response = await this.prisma.practitioner.findUnique({
        where: { email },
        select: {
          practitionerSocialMedia: true,
          email: true,
          id: true,
          uuid: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          middleName: true,
          message: true,
        },
      });
      if (
        !response.email ||
        !response.id ||
        !response.uuid ||
        !response.firstName
      ) {
        throw new Error('No users found');
      }
      return [
        {
          id: response.id,
          email: response.email,
          uuid: response.uuid,
          firstName: response.firstName,
          lastName: response?.lastName,
          middleName: response?.middleName,
          message: response?.message,
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
          name: e ? 'Not found' : 'Internal Server Error',
          message: e || 'Server Side Error: getPractitioner failed',
        },
      ];
    }
  }

  async createPractitioner({
    firstName,
    lastName,
    profileImage,
    email,
    message,
    middleName,
    instagram,
    facebook,
    twitter,
    website,
    uuid,
  }: createPractitionerArgs): Promise<[Practitioner?, Error?]> {
    try {
      const response = await this.prisma.practitioner.upsert({
        where: { email },
        create: {
          firstName,
          lastName,
          middleName,
          message,
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
          middleName,
          message,
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
          lastName: true,
          profileImage: true,
          middleName: true,
          message: true,
        },
      });

      if (
        !response.email ||
        !response.id ||
        !response.uuid ||
        !response.firstName
      ) {
        throw new Error();
      }
      return [
        {
          id: response.id,
          email: response.email,
          uuid: response.uuid,
          firstName: response.firstName,
          lastName: response?.lastName,
          middleName: response?.middleName,
          message: response?.message,
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

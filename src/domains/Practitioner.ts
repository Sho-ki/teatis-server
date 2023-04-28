import { SocialMedia } from './SocialMedia';

export interface Practitioner extends SocialMedia {
  id: number;
  uuid: string;
  email: string;
  profileImage?: string;
  firstName: string;
  lastName?: string;
  middleName: string;
  message: string;
}

import { IsEmail } from 'class-validator';

export class getPostPurchaseSurveyInfoDto {
  @IsEmail()
  email: string;
}

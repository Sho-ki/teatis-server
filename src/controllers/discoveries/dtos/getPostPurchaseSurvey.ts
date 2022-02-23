import { IsEmail } from 'class-validator';

export class GetPostPurchaseSurveyInfoDto {
  @IsEmail()
  email: string;
}

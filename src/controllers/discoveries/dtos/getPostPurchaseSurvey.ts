import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GetPostPurchaseSurveyInfoDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  orderNumber?: string;
}

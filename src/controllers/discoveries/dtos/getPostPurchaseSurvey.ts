import {  IsOptional, IsString } from 'class-validator';

export class GetPostPurchaseSurveyInfoDto {
  @IsString()
    uuid: string;

  @IsOptional()
  @IsString()
    orderNumber?: string;
}

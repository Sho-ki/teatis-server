import {  IsOptional, IsString } from 'class-validator';

export class GetPostPurchaseSurveyInfoDto {
  @IsString()
    uuid: string; // customer uuid

  @IsOptional()
  @IsString()
    orderNumber?: string;
}

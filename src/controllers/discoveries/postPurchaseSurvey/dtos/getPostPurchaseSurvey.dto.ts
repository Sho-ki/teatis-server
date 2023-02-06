import { IsString } from 'class-validator';

export class GetPostPurchaseSurveyDto {
    @IsString()
      uuid: string; // customer uuid

}


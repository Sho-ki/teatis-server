import { IsArray, IsOptional, IsString } from 'class-validator';

export class PostPrePurchaseSurvey2Dto {
  @IsString()
    customerUuid: string;

  @IsArray()
  @IsOptional()
    customerResponses?: {
       surveyQuestionId: number;
        responseIds: number[];
    }[];
}


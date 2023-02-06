import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostPrePurchaseSurvey2Dto {
  @IsNumber()
    surveyId: number;

  @IsString()
    customerUuid: string;

  @IsArray()
  @IsOptional()
    customerResponses?: {
       surveyQuestionId: number;
        responseIds: number[];
    }[];
}


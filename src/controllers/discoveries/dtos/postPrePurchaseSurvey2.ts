import { IsArray, IsString } from 'class-validator';

export class PostPrePurchaseSurvey2Dto {
  @IsString()
    customerUuid: string;

  @IsArray()
    customerResponses: {
       surveyQuestionId: number;
        responseIds: number[];
    }[];
}


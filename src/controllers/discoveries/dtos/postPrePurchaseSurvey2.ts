import { IsArray, IsNumber, IsString } from 'class-validator';

export class PostPrePurchaseSurvey2Dto {
  @IsNumber()
    surveyId: number;

  @IsString()
    customerUuid: string;

  @IsArray()
    surveyResponses: TTemp[];
}

type TTemp = {
  surveyQuestionId: number;
  responseIds: number[];
};

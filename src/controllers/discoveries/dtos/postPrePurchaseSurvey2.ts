import { IsArray, IsNumber, IsString } from 'class-validator';

export class PostPrePurchaseSurvey2Dto {
  @IsNumber()
    surveyId: number;

  @IsString()
    customerUuid: string;

  @IsArray()
    surveyResponse: TTemp[];
}

type TTemp = {
    questionId: number;
    responseIds: number[];
};

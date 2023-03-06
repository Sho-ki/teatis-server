import { IsString } from 'class-validator';

export class GetTemporaryPrePurchaseSurveyDto {
  @IsString()
    answerIdentifier:string;
}

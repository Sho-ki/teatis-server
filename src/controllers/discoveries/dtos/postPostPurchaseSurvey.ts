// import { ProductHasGlucoseImpact } from '@Domains/PostPurchaseSurvey';
import {
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class PostPostPurchaseSurveyDto {
  @IsNumber()
    historyId: number;

  @IsOptional()
  @IsArray()
    customerResponses?:{
      surveyQuestionId:number;
      response: number | number[] | string;
      productId:number;
  }[];
}

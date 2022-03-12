import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class PostPostPurchaseSurveyDto {
  @IsNumber()
  id: number;

  @IsNumber()
  customerId: number;

  @IsString()
  shopifyOrderNumber: string;

  @IsString()
  surveyQuestionAnswerType: string;

  @IsObject()
  questionCategory: { id: number; label: string; name: string };

  @IsObject()
  answer: {
    text?: string;
    numeric?: number;
    singleOption?: { id: number; label: string; name: string };
    multipleOptions?: { id: number; label: string; name: string }[];
    bool?: boolean;
  };

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

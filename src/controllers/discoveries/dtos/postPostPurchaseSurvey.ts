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

  @IsString()
  questionCategory: string;

  @IsOptional()
  @IsString()
  answerText?: string;

  @IsOptional()
  @IsNumber()
  answerNumeric?: number;

  @IsOptional()
  @IsNumber()
  answerSingleOptionId?: number;

  @IsOptional()
  @IsArray()
  answerOptions?: { id: number; label: string }[];

  @IsOptional()
  @IsBoolean()
  answerBool?: boolean;

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

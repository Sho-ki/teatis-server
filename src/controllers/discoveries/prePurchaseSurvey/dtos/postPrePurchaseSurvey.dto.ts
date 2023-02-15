import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostPrePurchaseSurveyDto {
  @IsNumber()
  @IsOptional()
    gender?: number;

  // @IsArray()
  //   categoryPreferences: number[];

  @IsArray()
    flavorDislikeIds: number[];

  @IsArray()
    ingredientDislikeIds: number[];

  @IsArray()
    allergenIds: number[];

  @IsString()
    email: string;
}

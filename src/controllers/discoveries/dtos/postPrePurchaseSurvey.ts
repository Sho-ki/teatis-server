import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostPrePurchaseSurveyDto {
  @IsString()
  @IsOptional()
    diabetes?: string;

  @IsString()
  @IsOptional()
    gender?: string;

  @IsNumber()
  @IsOptional()
    height?: number; // in cm

  @IsNumber()
  @IsOptional()
    weight?: number; // in kg

  @IsNumber()
  @IsOptional()
    age?: number;

  @IsArray()
  @IsOptional()
    medicalConditions?: { name: string, label?: string }[];

  @IsString()
  @IsOptional()
    activeLevel?: string;

  @IsString()
  @IsOptional()
    A1c?: string;

  @IsNumber()
  @IsOptional()
    mealsPerDay?: number;

  @IsArray()
  @IsOptional()
    categoryPreferences?: { name: string, label?: string }[];

  @IsArray()
  @IsOptional()
    coachingPreferences?: { name: string, label?: string }[];

  @IsArray()
  @IsOptional()
    flavorDislikes?: { name: string, label?: string }[];

  @IsArray()
  @IsOptional()
    ingredientDislikes?: { name: string, label?: string }[];

  @IsArray()
  @IsOptional()
    allergens?: { name: string, label?: string }[];

  @IsString()
    email: string;

  @IsArray()
  @IsOptional()
    unavailableCookingMethods?: { name: string, label?: string }[];

  @IsArray()
  @IsOptional()
    boxPlan?: string[];
}

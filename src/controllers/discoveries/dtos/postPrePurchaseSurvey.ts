import { IsArray, IsNumber, IsString } from 'class-validator';

export class PostPrePurchaseSurveyDto {
  @IsString()
  diabetes: string;

  @IsString()
  gender: string;

  @IsNumber()
  height: number; // in cm

  @IsNumber()
  weight: number; // in kg

  @IsNumber()
  age: number;

  @IsArray()
  medicalConditions: string[];

  @IsString()
  activeLevel: string;

  @IsString()
  A1c: string;

  @IsString()
  targetA1c: string;

  @IsNumber()
  mealsPerDay: number;

  @IsArray()
  categoryPreferences: string[];

  @IsArray()
  flavorDislikes: string[];

  @IsArray()
  ingredientDislikes: string[];

  @IsArray()
  allergens: string[];

  @IsString()
  email: string;

  @IsArray()
  unavailableCookingMethods: string[];
}

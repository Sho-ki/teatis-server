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
  medicalConditions: { name: string; label: string }[];

  @IsString()
  activeLevel: string;

  @IsString()
  A1c: string;

  @IsString()
  targetA1c: string;

  @IsNumber()
  mealsPerDay: number;

  @IsArray()
  categoryPreferences: { name: string; label: string }[];

  @IsArray()
  flavorDislikes: { name: string; label: string }[];

  @IsArray()
  ingredientDislikes: { name: string; label: string }[];

  @IsArray()
  allergens: { name: string; label: string }[];

  @IsString()
  email: string;

  @IsArray()
  unavailableCookingMethods: { name: string; label: string }[];
}

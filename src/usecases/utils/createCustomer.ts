import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CustomerPrePurchaseSurveyRepositoryInterface } from '@Repositories/teatisDB/customer/customerPrePurchaseSurvey.repository';
import { Customer } from '@Domains/Customer';
import { PostPrePurchaseSurveyDto } from '@Controllers/discoveries/dtos/postPrePurchaseSurvey';

interface CreateCustomerUsecaseArgs extends PostPrePurchaseSurveyDto {}

export interface CreateCustomerUsecaseInterface {
  createCustomer({
    diabetes,
    gender,
    height, // in cm
    weight, // in kg
    age,
    medicalConditions,
    activeLevel,
    A1c,
    mealsPerDay,
    categoryPreferences,
    flavorDislikes,
    ingredientDislikes,
    allergens,
    email,
    unavailableCookingMethods,
    boxPlan,
  }: CreateCustomerUsecaseArgs): Promise<[Customer, Error]>;
}

@Injectable()
export class CreateCustomerUsecase implements CreateCustomerUsecaseInterface {
  constructor(
    @Inject('CustomerPrePurchaseSurveyRepositoryInterface')
    private readonly customerPrePurchaseRepository: CustomerPrePurchaseSurveyRepositoryInterface,
  ) {}

  outlierValidate(name: 'height' | 'weight' | 'age', value: number): number {
    let max: number, min: number, defVal: number;
    switch (name) {
      case 'height':
        max = 250;
        min = 100;
        defVal = 160;
        break;
      case 'weight':
        max = 300;
        min = 30;
        defVal = 70;
        break;
      case 'age':
        max = 100;
        min = 10;
        defVal = 50;
        break;
    }
    return value > max ? defVal : value < min ? defVal : value;
  }

  // Step 1: Calculate calorie needs
  // Step 2: Calculate individual macronutrients
  // Step 3: Custom meal plan based on recommendations
  async createCustomer({
    diabetes = 'unknown',
    gender = 'female',
    height = 160, // in cm
    weight = 70, // in kg
    age = 50,
    activeLevel = 'notActive',
    A1c = 'unknown',
    mealsPerDay = 4,
    medicalConditions = [],
    categoryPreferences = [],
    flavorDislikes = [],
    ingredientDislikes = [],
    allergens = [],
    email,
    unavailableCookingMethods = [],
    boxPlan,
  }: CreateCustomerUsecaseArgs): Promise<[Customer, Error]> {
    //   Calculate Method: https://www.notion.so/teatis/Discovery-engine-3de1c3b8bce74ec78210f6624b4eaa86
    height = this.outlierValidate('height', height);
    weight = this.outlierValidate('weight', weight);
    age = this.outlierValidate('age', age);

    let BMR: number;

    if (gender === 'male') {
      BMR = Math.round(
        66.473 + 13.7516 * weight + 5.0033 * height - 6.755 * age,
      );
    } else {
      BMR = Math.round(
        655.0955 + 9.5634 * weight + 1.8496 * height - 4.6756 * age,
      );
    }

    let carbsMacronutrients: number;
    let proteinMacronutrients: number;
    let fatMacronutrients: number;

    switch (activeLevel) {
      case 'veryActive':
        carbsMacronutrients = Math.round((BMR * 0.45) / 4);
        proteinMacronutrients = Math.round((BMR * 0.35) / 4);
        fatMacronutrients = Math.round((BMR * 0.2) / 9);
        break;
      case 'moderatelyActive':
        carbsMacronutrients = Math.round((BMR * 0.4) / 4);
        proteinMacronutrients = Math.round((BMR * 0.35) / 4);
        fatMacronutrients = Math.round((BMR * 0.25) / 9);
        break;
      case 'notActive':
        carbsMacronutrients = Math.round((BMR * 0.35) / 4);
        proteinMacronutrients = Math.round((BMR * 0.35) / 4);
        fatMacronutrients = Math.round((BMR * 0.3) / 9);
        break;
      default:
        // if no answer
        carbsMacronutrients = Math.round((BMR * 0.4) / 4);
        proteinMacronutrients = Math.round((BMR * 0.35) / 4);
        fatMacronutrients = Math.round((BMR * 0.25) / 9);
        break;
    }

    let carbsPerMeal = Math.round(carbsMacronutrients * 0.25);
    let proteinPerMeal = Math.round(proteinMacronutrients * 0.25);
    let fatPerMeal = Math.round(fatMacronutrients * 0.25);
    let caloriePerMeal = Math.round(BMR * 0.25);

    const uuid = uuidv4();
    const [customer, upsertCustomerError] =
      await this.customerPrePurchaseRepository.upsertCustomer({
        uuid,
        diabetes,
        gender,
        height, // in cm
        weight, // in kg
        age,
        medicalConditions,
        activeLevel,
        A1c,
        mealsPerDay,
        categoryPreferences,
        flavorDislikes,
        ingredientDislikes,
        allergens,
        email,
        unavailableCookingMethods,
        BMR,
        carbsMacronutrients,
        proteinMacronutrients,
        fatMacronutrients,
        carbsPerMeal,
        proteinPerMeal,
        fatPerMeal,
        caloriePerMeal,
        boxPlan,
      });
    if (upsertCustomerError) {
      return [null, upsertCustomerError];
    }

    return [
      {
        id: customer.id,
        uuid: customer.uuid,
        email,
      },
      null,
    ];
  }
}

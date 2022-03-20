import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
  GetProductRes as ShopifyGetProductRes,
  ShopifyRepoInterface,
} from 'src/repositories/shopify/shopify.repository';
import { CustomerPrePurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerPrePurchaseSurvey.repository';
import { PostPrePurchaseSurveyDto } from '../../controllers/discoveries/dtos/postPrePurchaseSurvey';

export interface PostPrePurchaseSurveyUsecaseRes {
  customerId: number;
  customerUuid: string;
  recommendProductData: {
    id: number;
    title: string;
    sku: string;
  };
}

export interface PostPrePurchaseSurveyUsecaseInterface {
  postPrePurchaseSurvey({
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
  }: PostPrePurchaseSurveyDto): Promise<
    [PostPrePurchaseSurveyUsecaseRes, Error]
  >;
}

@Injectable()
export class PostPrePurchaseSurveyUsecase
  implements PostPrePurchaseSurveyUsecaseInterface
{
  constructor(
    @Inject('ShopifyRepoInterface')
    private readonly shopifyRepo: ShopifyRepoInterface,
    @Inject('CustomerPrePurchaseSurveyRepoInterface')
    private readonly customerPrePurchaseRepo: CustomerPrePurchaseSurveyRepoInterface,
  ) {}

  private hasHighBloodPressure(
    medicalConditions: { name: string; label: string }[],
  ) {
    if (
      medicalConditions &&
      medicalConditions.length > 0 &&
      medicalConditions.some((medicalCondition) => {
        return medicalCondition.name === 'highBloodPressure';
      })
    ) {
      return true;
    }
    return false;
  }
  // Step 1: Calculate calorie needs
  // Step 2: Calculate individual macronutrients
  // Step 3: Custom meal plan based on recommendations
  async postPrePurchaseSurvey({
    diabetes = 'unknown',
    gender,
    height = 160, // in cm
    weight = 100, // in kg
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
  }: PostPrePurchaseSurveyDto): Promise<
    [PostPrePurchaseSurveyUsecaseRes, Error]
  > {
    //   Calculate Method: https://www.notion.so/teatis/Discovery-engine-3de1c3b8bce74ec78210f6624b4eaa86
    let BMR: number;

    if (gender === 'male') {
      BMR = Math.round(
        66.473 + 13.7516 * weight + 5.0033 * height - 6.755 * age,
      );
    } else {
      // if female or no answer
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
        fatMacronutrients = Math.round((BMR * 0.2) / 4);
        break;
      case 'moderatelyActive':
        carbsMacronutrients = Math.round((BMR * 0.4) / 4);
        proteinMacronutrients = Math.round((BMR * 0.35) / 4);
        fatMacronutrients = Math.round((BMR * 0.25) / 4);
        break;
      case 'notActive':
        carbsMacronutrients = Math.round((BMR * 0.35) / 4);
        proteinMacronutrients = Math.round((BMR * 0.35) / 4);
        fatMacronutrients = Math.round((BMR * 0.3) / 4);
        break;
      default:
        // if no answer
        carbsMacronutrients = Math.round((BMR * 0.4) / 4);
        proteinMacronutrients = Math.round((BMR * 0.35) / 4);
        fatMacronutrients = Math.round((BMR * 0.25) / 4);
        break;
    }

    let carbsPerMeal = Math.round(carbsMacronutrients * 0.25);
    let proteinPerMeal = Math.round(proteinMacronutrients * 0.25);
    let fatPerMeal = Math.round(fatMacronutrients * 0.25);
    let caloriePerMeal = Math.round(BMR * 0.25);

    const isHighBloodPressure: boolean =
      this.hasHighBloodPressure(medicalConditions);

    const productId: number = isHighBloodPressure
      ? 6618823753783 //  Healthy carb & Low sodium
      : 6618823458871; //  Healthy carb

    const recommendProductData: ShopifyGetProductRes =
      await this.shopifyRepo.getProduct({ productId });

    const uuid = uuidv4();

    const [customer, customerError] =
      await this.customerPrePurchaseRepo.upsertCustomer({
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
      });
    if (customerError) {
      return [null, customerError];
    }

    return [
      {
        customerId: customer.customerId,
        customerUuid: customer.customerUuid,
        recommendProductData,
      },
      null,
    ];
  }
}

import { Inject, Injectable } from '@nestjs/common';

import {
  GetProductRes as ShopifyGetProductRes,
  ShopifyRepoInterface,
} from 'src/repositories/shopify/shopify.repository';
import { CustomerPrePurchaseSurveyRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerPrePurchaseSurvey.repository';
import { PostPrePurchaseSurveyDto } from '../../controllers/discoveries/dtos/postPrePurchaseSurvey';

export interface PostPrePurchaseSurveyUsecaseRes {
  customerId: number;
  recommendProductData: {
    id: number;
    title: string;
    vendor: string;
    images?: PostPrePurchaseSurveyUsecaseImage[];
    sku: string;
    provider: string;
  };
}

interface PostPrePurchaseSurveyUsecaseImage {
  position: number;
  alt?: string;
  src: string;
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
    targetA1c,
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

  private getMatchedProductId(
    carbsPerMeal: number,
    isHighBloodPressure: boolean,
  ): number {
    let productId: number;
    const counts = [15, 30];
    const goal = carbsPerMeal;
    const closest = counts.reduce((prev, curr) => {
      return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
    });

    switch (closest) {
      case 30:
        // If highBolldPressure === true, set productId Moderate carb & Low sodium
        // else set productId Moderate carb
        productId = isHighBloodPressure ? 6618823753783 : 6618823458871;
        break;
      default:
        //If closest === 15, set productId Low carb
        productId = 6618822967351;
    }
    return productId;
  }
  // Step 1: Calculate calorie needs
  // Step 2: Calculate individual macronutrients
  // Step 3: Custom meal plan based on recommendations
  async postPrePurchaseSurvey({
    diabetes,
    gender,
    height, // in cm
    weight, // in kg
    age,
    medicalConditions,
    activeLevel,
    A1c,
    targetA1c,
    mealsPerDay,
    categoryPreferences,
    flavorDislikes,
    ingredientDislikes,
    allergens,
    email,
    unavailableCookingMethods,
  }: PostPrePurchaseSurveyDto): Promise<
    [PostPrePurchaseSurveyUsecaseRes, Error]
  > {
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
        activeLevel = 'veryActive';
        break;
      case 'moderatelyActive':
        carbsMacronutrients = Math.round((BMR * 0.4) / 4);
        proteinMacronutrients = Math.round((BMR * 0.35) / 4);
        fatMacronutrients = Math.round((BMR * 0.25) / 4);
        activeLevel = 'moderatelyActive';
        break;
      case 'notActive':
        carbsMacronutrients = Math.round((BMR * 0.35) / 4);
        proteinMacronutrients = Math.round((BMR * 0.35) / 4);
        fatMacronutrients = Math.round((BMR * 0.3) / 4);
        activeLevel = 'notActive';
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

    let isHighBloodPressure: boolean = false;
    if (
      medicalConditions.length > 0 &&
      medicalConditions.some((medicalCondition) => {
        return medicalCondition.name === 'highBloodPressure';
      })
    ) {
      isHighBloodPressure = true;
    }

    const productId: number = this.getMatchedProductId(
      carbsPerMeal,
      isHighBloodPressure,
    );

    const recommendProductData: ShopifyGetProductRes =
      await this.shopifyRepo.getProduct({ productId });

    const [customer, customerError] =
      await this.customerPrePurchaseRepo.upsertCustomer({
        diabetes,
        gender,
        height, // in cm
        weight, // in kg
        age,
        medicalConditions,
        activeLevel,
        A1c,
        targetA1c,
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
        recommendProductData,
      },
      null,
    ];
  }
}

import { Injectable } from '@nestjs/common';

import {
  Step2Response,
  Step3Response,
  DiscoveryResponse,
} from '../types/discoveryResponse';
import { ShopifyRepo } from '../repositories/shopify/shopifyRepo';
import { TypeFormRepo } from '../repositories/typeform/typeformRepo';

export interface GetRecommendProductsUseCaseInterface {
  getRecommendProducts(discoveryTypeformId: string): Promise<any>;
}

@Injectable()
export class GetRecommendProductsUseCase
  implements GetRecommendProductsUseCaseInterface
{
  constructor(
    private typeFormRepo: TypeFormRepo,
    private shopifyRepo: ShopifyRepo,
  ) {}

  // Step 1: Calculate calorie needs
  // Default values are from the average of woman in the States
  private calculateBMR(
    gender: string,
    age: number = 40,
    height: number = 55,
    weight: number = 170,
  ): number {
    height = height * 2.54; // inches to cm
    weight = weight * 0.453592; // lb to kg
    if (gender === 'male') {
      return Math.round(
        66.473 + 13.7516 * weight + 5.0033 * height - 6.755 * age,
      );
    } else {
      // if female or no answer
      return Math.round(
        655.0955 + 9.5634 * weight + 1.8496 * height - 4.6756 * age,
      );
    }
  }

  // Step 2: Calculate individual macronutrients
  private calculateMacronutrients(
    BMR: number,
    activeLevel: string = 'moderatelyActive',
  ): Step2Response {
    let macronutrientsObj = {};
    switch (activeLevel) {
      case 'veryActive':
        macronutrientsObj['carbs'] = Math.round((BMR * 0.45) / 4);
        macronutrientsObj['protein'] = Math.round((BMR * 0.35) / 4);
        macronutrientsObj['fat'] = Math.round((BMR * 0.2) / 4);
        break;
      case 'moderatelyActive':
        macronutrientsObj['carbs'] = Math.round((BMR * 0.4) / 4);
        macronutrientsObj['protein'] = Math.round((BMR * 0.35) / 4);
        macronutrientsObj['fat'] = Math.round((BMR * 0.25) / 4);
        break;
      case 'notActive':
        macronutrientsObj['carbs'] = Math.round((BMR * 0.35) / 4);
        macronutrientsObj['protein'] = Math.round((BMR * 0.35) / 4);
        macronutrientsObj['fat'] = Math.round((BMR * 0.3) / 4);
        break;
      default:
        // if no answer
        macronutrientsObj['carbs'] = Math.round((BMR * 0.4) / 4);
        macronutrientsObj['protein'] = Math.round((BMR * 0.35) / 4);
        macronutrientsObj['fat'] = Math.round((BMR * 0.25) / 4);
        break;
    }
    return {
      carbsMacronutrients: macronutrientsObj['carbs'],
      proteinMacronutrients: macronutrientsObj['protein'],
      fatMacronutrients: macronutrientsObj['fat'],
    };
  }

  // Step 3: Custom meal plan based on recommendations
  private calculatePerMeal(
    carbs: number,
    protein: number,
    fat: number,
    BMR: number,
  ): Step3Response {
    return {
      carbsPerMeal: Math.round(carbs * 0.25),
      proteinPerMeal: Math.round(protein * 0.25),
      fatPerMeal: Math.round(fat * 0.25),
      caloriePerMeal: Math.round(BMR * 0.25),
    };
  }

  async getRecommendProducts(discoveryTypeformId: string): Promise<any> {
    const typeformResponse: DiscoveryResponse =
      await this.typeFormRepo.getDiscoveryResponses(discoveryTypeformId);

    let BMR: number = this.calculateBMR(
      typeformResponse.gender,
      typeformResponse.age,
      typeformResponse.height,
      typeformResponse.weight,
    );
    let {
      carbsMacronutrients,
      proteinMacronutrients,
      fatMacronutrients,
    }: Step2Response = this.calculateMacronutrients(
      BMR,
      typeformResponse.activelevel,
    );

    const {
      carbsPerMeal,
      proteinPerMeal,
      fatPerMeal,
      caloriePerMeal,
    }: Step3Response = this.calculatePerMeal(
      carbsMacronutrients,
      proteinMacronutrients,
      fatMacronutrients,
      BMR,
    );
    const email = typeformResponse.email;

    const recommendProductData = await this.shopifyRepo.getMatchedProduct(
      carbsPerMeal,
      typeformResponse['medicalConditions'] === 'hightBloodPressure',
    );

    return {
      recommendProductData,
      email,
      BMR,
      carbsMacronutrients,
      proteinMacronutrients,
      fatMacronutrients,
      carbsPerMeal,
      proteinPerMeal,
      fatPerMeal,
      caloriePerMeal,
    };
  }
}

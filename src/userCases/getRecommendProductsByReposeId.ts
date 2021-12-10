import { Injectable } from '@nestjs/common';
import { TypeFormRepostitory } from 'src/repositories/typeform/TypeformRepo';
import {
  Step2Response,
  Step3Response,
  UserResponse,
} from 'src/types/UserResponse';

interface GetRecommendProductsUseCaseInterface {
  // function is not completed, so using any type
  getRecommendProducts(userResponseId: string): any;
}

@Injectable()
export class GetRecommendProductsUseCase
  implements GetRecommendProductsUseCaseInterface
{
  constructor(private typeFormRepo: TypeFormRepostitory) {}

  // Step 1: Calculate calorie needs
  private calculateBMR(
    gender: string,
    age: number,
    height: number,
    weight: number,
  ): number {
    height = height * 2.54; // inches to cm
    weight = weight * 0.453592; // lb to kg
    if (gender === 'male') {
      return 66.473 + 13.7516 * weight + 5.0033 * height - 6.755 * age;
    } else {
      return 655.0955 + 9.5634 * weight + 1.8496 * height - 4.6756 * age; // if female or no answer
    }
  }

  // Step 2: Calculate individual macronutrients
  private calculateMacronutrients(
    bmr: number,
    activeLevel: string,
  ): Step2Response {
    let macronutrientsObj = {};
    switch (activeLevel) {
      case 'veryActive':
        macronutrientsObj['carbs'] = (bmr * 0.45) / 4;
        macronutrientsObj['protein'] = (bmr * 0.35) / 4;
        macronutrientsObj['fat'] = (bmr * 0.2) / 4;
        break;
      case 'moderatelyActive':
        macronutrientsObj['carbs'] = (bmr * 0.4) / 4;
        macronutrientsObj['protein'] = (bmr * 0.35) / 4;
        macronutrientsObj['fat'] = (bmr * 0.25) / 4;
        break;
      case 'notActive':
        macronutrientsObj['carbs'] = (bmr * 0.35) / 4;
        macronutrientsObj['protein'] = (bmr * 0.35) / 4;
        macronutrientsObj['fat'] = (bmr * 0.3) / 4;
        break;
      default:
        // if no answer
        macronutrientsObj['carbs'] = (bmr * 0.4) / 4;
        macronutrientsObj['protein'] = (bmr * 0.35) / 4;
        macronutrientsObj['fat'] = (bmr * 0.25) / 4;
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
    bmr: number,
  ): Step3Response {
    return {
      carbsPerMeal: carbs * 0.25,
      proteinPerMeal: protein * 0.25,
      fatPerMeal: fat * 0.25,
      caloriePerMeal: bmr * 0.25,
    };
  }

  async getRecommendProducts(userResponseId: string): Promise<any> {
    const typeformResponse: UserResponse =
      await this.typeFormRepo.getUserResponses(userResponseId);

    let bmr: number = this.calculateBMR(
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
      bmr,
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
      bmr,
    );
  }
}

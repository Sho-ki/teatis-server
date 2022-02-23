import { Inject, Injectable } from '@nestjs/common';
import {
  GetRecommendProductsUsecaseArgs,
  GetRecommendProductsUsecaseRes,
} from '../../domains/prePurchaseSurvey/getRecommendProductsUsecaseRes';
import {
  GetProductRes as ShopifyGetProductRes,
  ShopifyRepoInterface,
} from '../../repositories/shopify/shopify.repository';
import {
  CustomerPrePurchaseSurveyRepoInterface,
  UpsertCustomerRes as TeatisDBUpsertCustomerRes,
} from '../../repositories/teatisDB/customerRepo/customerPrePurchaseSurvey.repository';
import {
  GetCustomerAnsRes as TypeformGetCustomerAnsRes,
  TypeformRepoInterface,
} from '../../repositories/typeform/typeform.repository';

interface PrePurchaseSurveyCustomerRes {
  a1c: string;
  a1cgoal: string;
  activelevel: string;
  age: number;
  diabetes: string;
  foodpalate: number;
  gender: string;
  height: number;
  medicalconditions: string;
  sweetorsavory: string;
  weight: number;
  allergies: string;
  tastePreferences: string[];
  email: string;
}

interface CustomerNutritions {
  BMR: number;
  carbsMacronutrients: number;
  proteinMacronutrients: number;
  fatMacronutrients: number;
  carbsPerMeal: number;
  proteinPerMeal: number;
  fatPerMeal: number;
  caloriePerMeal: number;
}

export interface GetRecommendProductsUseCaseInterface {
  getRecommendProducts({
    typeformId,
  }: GetRecommendProductsUsecaseArgs): Promise<any>;
}

@Injectable()
export class GetRecommendProductsUseCase
  implements GetRecommendProductsUseCaseInterface
{
  constructor(
    @Inject('TypeformRepoInterface')
    private readonly typeFormRepo: TypeformRepoInterface,
    @Inject('ShopifyRepoInterface')
    private readonly shopifyRepo: ShopifyRepoInterface,
    @Inject('CustomerPrePurchaseSurveyRepoInterface')
    private readonly customerPrePurchaseRepo: CustomerPrePurchaseSurveyRepoInterface,
  ) {}

  private createPrePurchaseSurveyAnswer(
    typeformResponses: TypeformGetCustomerAnsRes[],
  ): PrePurchaseSurveyCustomerRes {
    let QASetObj = {} as PrePurchaseSurveyCustomerRes;

    typeformResponses.map((response: TypeformGetCustomerAnsRes) => {
      switch (response.field.ref) {
        case 'diabetes':
          return (QASetObj['diabetes'] = response.choice.ref);
        case 'gender':
          return (QASetObj['gender'] = response.choice.ref);
        case 'height':
          return (QASetObj['height'] = response.number);
        case 'weight':
          return (QASetObj['weight'] = response.number);
        case 'age':
          return (QASetObj['age'] = response.number);
        case 'medicalConditions':
          if (response.choice !== undefined) {
            return (QASetObj['medicalConditions'] = response.choice.ref);
          } else {
            return (QASetObj['medicalConditions'] = response.choices.refs);
          }
        case 'tastePreferences':
          return (QASetObj['tastePreferences'] = response.choices.refs);
        case 'activeLevel':
          return (QASetObj['activeLevel'] = response.choice.ref);
        case 'a1cScore':
          return (QASetObj['a1cScore'] = response.choice.ref);
        case 'a1cScoreGoal':
          return (QASetObj['a1cScoreGoal'] = response.choice.ref);
        case 'allergies':
          return (QASetObj['allergies'] = response.text);
        case 'tastePreferences':
          return (QASetObj['tastePreferences'] = response.choices.refs);
        case 'sweetOrSavory':
          return (QASetObj['sweetOrSavory'] = response.choice.ref);
        case 'foodPalate':
          return (QASetObj['foodPalate'] = response.number);
        case 'email':
          return (QASetObj['email'] = response.email);
        default:
          break;
      }
    });
    return QASetObj;
  }

  // Step 1: Calculate calorie needs
  // Default values are from the average of woman in the States
  private calculateBMR(
    gender: string,
    age: number = 40,
    height: number = 55,
    weight: number = 170,
  ): Partial<CustomerNutritions> {
    height = height * 2.54; // inches to cm
    weight = weight * 0.453592; // lb to kg

    if (gender === 'male') {
      return {
        BMR: Math.round(
          66.473 + 13.7516 * weight + 5.0033 * height - 6.755 * age,
        ),
      };
    } else {
      // if female or no answer
      return {
        BMR: Math.round(
          655.0955 + 9.5634 * weight + 1.8496 * height - 4.6756 * age,
        ),
      };
    }
  }

  // Step 2: Calculate individual macronutrients
  private calculateMacronutrients(
    BMR: number,
    activeLevel: string = 'moderatelyActive',
  ): Partial<CustomerNutritions> {
    let macronutrientsObj = {} as Partial<CustomerNutritions>;
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
  ): Partial<CustomerNutritions> {
    return {
      carbsPerMeal: Math.round(carbs * 0.25),
      proteinPerMeal: Math.round(protein * 0.25),
      fatPerMeal: Math.round(fat * 0.25),
      caloriePerMeal: Math.round(BMR * 0.25),
    };
  }

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

  async getRecommendProducts({
    typeformId,
  }: GetRecommendProductsUsecaseArgs): Promise<GetRecommendProductsUsecaseRes> {
    const typeformResponses: TypeformGetCustomerAnsRes[] =
      await this.typeFormRepo.getCustomerResponse({ typeformId });

    let prePurchaseSurveyAnswer: PrePurchaseSurveyCustomerRes =
      this.createPrePurchaseSurveyAnswer(typeformResponses);
    const email = prePurchaseSurveyAnswer.email;

    let { BMR }: Partial<CustomerNutritions> = this.calculateBMR(
      prePurchaseSurveyAnswer.gender,
      prePurchaseSurveyAnswer.age,
      prePurchaseSurveyAnswer.height,
      prePurchaseSurveyAnswer.weight,
    );

    let {
      carbsMacronutrients,
      proteinMacronutrients,
      fatMacronutrients,
    }: Partial<CustomerNutritions> = this.calculateMacronutrients(
      BMR,
      prePurchaseSurveyAnswer.activelevel,
    );

    const {
      carbsPerMeal,
      proteinPerMeal,
      fatPerMeal,
      caloriePerMeal,
    }: Partial<CustomerNutritions> = this.calculatePerMeal(
      carbsMacronutrients,
      proteinMacronutrients,
      fatMacronutrients,
      BMR,
    );

    let isHighBloodPressure: boolean = false;
    if (
      prePurchaseSurveyAnswer['medicalConditions'] &&
      prePurchaseSurveyAnswer['medicalConditions'].indexOf(
        'highBloodPressure',
      ) >= 0
    ) {
      isHighBloodPressure = true;
    }

    const productId: number = this.getMatchedProductId(
      carbsPerMeal,
      isHighBloodPressure,
    );

    const recommendProductData: ShopifyGetProductRes =
      await this.shopifyRepo.getProduct({ productId });

    const { customerId }: TeatisDBUpsertCustomerRes =
      await this.customerPrePurchaseRepo.upsertCustomer({
        email,
        BMR,
        carbsMacronutrients,
        proteinMacronutrients,
        fatMacronutrients,
        carbsPerMeal,
        proteinPerMeal,
        fatPerMeal,
        caloriePerMeal,
      });

    return {
      customerId,
      recommendProductData,
    };
  }
}

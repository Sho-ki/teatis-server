import { Inject, Injectable } from '@nestjs/common';

import {
  GetProductRes as ShopifyGetProductRes,
  ShopifyRepoInterface,
} from '../../repositories/shopify/shopify.repository';
import { CustomerGeneralRepoInterface } from '../../repositories/teatisDB/customerRepo/customerGeneral.repository';
import {
  CustomerPrePurchaseSurveyRepoInterface,
  UpsertCustomerRes as TeatisDBUpsertCustomerRes,
} from '../../repositories/teatisDB/customerRepo/customerPrePurchaseSurvey.repository';
import {
  GetCustomerAnsRes as TypeformGetCustomerAnsRes,
  TypeformRepoInterface,
} from '../../repositories/typeform/typeform.repository';

interface GetRecommendProductsUsecaseArgs {
  typeformId: string;
}

export interface GetRecommendProductsUsecaseRes {
  recommendProductData: {
    id: number;
    title: string;
    vendor: string;
    images?: GetRecommendProductsUsecaseImage[] | null;
    sku: string;
    provider: string;
  };
}

interface GetRecommendProductsUsecaseImage {
  position: number;
  alt: string | null;
  src: string;
}

interface PrePurchaseSurveyCustomerRes {
  A1c: string;
  targetA1c: string;
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
  }: GetRecommendProductsUsecaseArgs): Promise<GetRecommendProductsUsecaseRes>;
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
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
  ) {}

  private createPrePurchaseSurveyAnswer(
    typeformResponses: TypeformGetCustomerAnsRes[],
  ): PrePurchaseSurveyCustomerRes {
    let QASetObj = {} as PrePurchaseSurveyCustomerRes;

    typeformResponses.map((response: TypeformGetCustomerAnsRes) => {
      switch (response.field.ref) {
        case 'diabetes':
          return (QASetObj['diabetes'] = response.choice.label);
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
          return (QASetObj['A1c'] = response.choice.label);
        case 'a1cScoreGoal':
          return (QASetObj['targetA1c'] = response.choice.label);
        case 'allergies':
          return (QASetObj['allergies'] = response.text);
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
  async getRecommendProducts({
    typeformId,
  }: GetRecommendProductsUsecaseArgs): Promise<GetRecommendProductsUsecaseRes> {
    const typeformResponses: TypeformGetCustomerAnsRes[] =
      await this.typeFormRepo.getCustomerResponse({ typeformId });

    let prePurchaseSurveyAnswer: PrePurchaseSurveyCustomerRes =
      this.createPrePurchaseSurveyAnswer(typeformResponses);
    const email = prePurchaseSurveyAnswer.email;

    const gender = prePurchaseSurveyAnswer.gender || 'female';
    const age = prePurchaseSurveyAnswer.age || 50;
    let height = prePurchaseSurveyAnswer.height || 55;
    let weight = prePurchaseSurveyAnswer.weight || 170;
    height = Math.round(height * 2.54 * 10); // inches to cm
    height /= 10;
    weight = Math.round(weight * 0.453592 * 10); // lb to kg
    weight /= 10;

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
    let activeLevel: string =
      prePurchaseSurveyAnswer.activelevel || 'moderatelyActive';

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
    // console.log(prePurchaseSurveyAnswer);
    // const [customer, customerError] =
    //   await this.customerPrePurchaseRepo.upsertCustomer({
    //     email,
    //     BMR,
    //     carbsMacronutrients,
    //     proteinMacronutrients,
    //     fatMacronutrients,
    //     carbsPerMeal,
    //     proteinPerMeal,
    //     fatPerMeal,
    //     caloriePerMeal,
    //     height,
    //     weight,
    //     age,
    //     gender,
    //     prePurchaseSurveyAnswer,
    //   });

    return {
      // customerId: customer.customerId,
      recommendProductData,
    };
  }
}

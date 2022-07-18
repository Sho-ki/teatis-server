import { Inject, Injectable } from '@nestjs/common';

import { PostPrePurchaseSurveyDto } from '@Controllers/discoveries/dtos/postPrePurchaseSurvey';
import { CreateCustomerUsecaseInterface } from '../utils/createCustomer';
import { Customer } from '@Domains/Customer';
import { BoxType } from '@Domains/BoxType';

export interface PostPrePurchaseSurveyUsecaseRes {
  customerId: number;
  customerUuid: string;
  recommendBoxType: string;
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
    boxPlan,
  }: PostPrePurchaseSurveyDto): Promise<
    [PostPrePurchaseSurveyUsecaseRes, Error]
  >;
}

@Injectable()
export class PostPrePurchaseSurveyUsecase
  implements PostPrePurchaseSurveyUsecaseInterface
{
  constructor(
    @Inject('CreateCustomerUsecaseInterface')
    private readonly createCustomerUsecaseUtil: CreateCustomerUsecaseInterface,
  ) {}

  private getCustomerBoxType(medicalConditions: string[]): BoxType {
    if (medicalConditions.length <= 0) {
      const type: BoxType = 'HC';
      return type; // Healthy Carb
    }

    if (medicalConditions.includes('highBloodPressure')) {
      const type: BoxType = 'HCLS';
      return type; // Healthy Carb & Low Sodium
    }
  }
  async postPrePurchaseSurvey({
    diabetes,
    gender,
    height,
    weight,
    age,
    activeLevel,
    A1c,
    mealsPerDay,
    medicalConditions,
    categoryPreferences,
    flavorDislikes,
    ingredientDislikes,
    allergens,
    email,
    unavailableCookingMethods,
    boxPlan,
  }: PostPrePurchaseSurveyDto): Promise<
    [PostPrePurchaseSurveyUsecaseRes, Error]
  > {
    const recommendBoxType: BoxType = medicalConditions
      ? this.getCustomerBoxType(
          medicalConditions.map((condition) => {
            return condition.name;
          }),
        )
      : 'HC';

    const [customer, createCustomerError]: [Customer?, Error?] =
      await this.createCustomerUsecaseUtil.createCustomer({
        diabetes,
        gender,
        height,
        weight,
        age,
        activeLevel,
        A1c,
        mealsPerDay,
        medicalConditions,
        categoryPreferences,
        flavorDislikes,
        ingredientDislikes,
        allergens,
        email,
        unavailableCookingMethods,
        boxPlan,
      });
    if (createCustomerError) {
      return [undefined, createCustomerError];
    }

    return [
      {
        customerId: customer.id,
        customerUuid: customer.uuid,
        recommendBoxType,
      },
      undefined,
    ];
  }
}

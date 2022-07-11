import { Inject, Injectable } from '@nestjs/common';

import { PostPrePurchaseSurveyDto } from '@Controllers/discoveries/dtos/postPrePurchaseSurvey';
import { CreateCustomerUsecaseInterface } from '../utils/createCustomer';
import { Customer } from '@Domains/Customer';

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

  private getCustomerBoxType(medicalConditions: string[]): string {
    if (medicalConditions.length <= 0) {
      return 'HC'; // Healthy Carb
    }

    if (medicalConditions.includes('highBloodPressure')) {
      return 'HCLS'; // Healthy Carb & Low Sodium
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
  }: PostPrePurchaseSurveyDto): Promise<
    [PostPrePurchaseSurveyUsecaseRes, Error]
  > {
    const customerMedicalConditions = medicalConditions.map((condition) => {
      return condition.name;
    });
    const recommendBoxType = this.getCustomerBoxType(customerMedicalConditions);

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
      });
    if (createCustomerError) {
      return [null, createCustomerError];
    }

    return [
      {
        customerId: customer.id,
        customerUuid: customer.uuid,
        recommendBoxType,
      },
      null,
    ];
  }
}

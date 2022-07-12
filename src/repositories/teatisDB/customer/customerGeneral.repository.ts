import { Injectable } from '@nestjs/common';
import { Customer } from '@Domains/Customer';

import { PrismaService } from '../../../prisma.service';
import { Preference } from '@Domains/Preference';
import { NutritionNeed } from '@Domains/NutritionNeed';
import { CustomerMedicalCondition } from '@Domains/CustomerMedicalCondition';

export interface GetCustomerArgs {
  email: string;
}

interface GetCustomerPreferenceArgs {
  type:
    | 'flavorDislikes'
    | 'allergens'
    | 'unavailableCookingMethods'
    | 'categoryPreferences';
  email: string;
}

interface GetCustomerByUuidArgs {
  uuid: string;
}

interface GetCustomerMedicalConditionArgs {
  email: string;
}

interface UpdateEmailByUuidArgs {
  uuid: string;
  newEmail: string;
}

interface GetCustomerNutritionArgs {
  uuid: string;
}

export interface CustomerGeneralRepositoryInterface {
  getCustomer({ email }: GetCustomerArgs): Promise<[Customer?, Error?]>;
  getCustomerPreference({
    email,
  }: GetCustomerPreferenceArgs): Promise<[Preference?, Error?]>;
  getCustomerMedicalCondition({
    email,
  }: GetCustomerMedicalConditionArgs): Promise<
    [CustomerMedicalCondition?, Error?]
  >;
  getCustomerNutrition({
    uuid,
  }: GetCustomerNutritionArgs): Promise<[NutritionNeed?, Error?]>;
  getCustomerByUuid({
    uuid,
  }: GetCustomerByUuidArgs): Promise<[Customer?, Error?]>;

  updateCustomerEmailByUuid({
    uuid,
    newEmail,
  }: UpdateEmailByUuidArgs): Promise<[Customer?, Error?]>;
}

@Injectable()
export class CustomerGeneralRepository
  implements CustomerGeneralRepositoryInterface
{
  constructor(private prisma: PrismaService) {}

  async getCustomerNutrition({
    uuid,
  }: GetCustomerNutritionArgs): Promise<[NutritionNeed?, Error?]> {
    const response = await this.prisma.customers.findUnique({
      where: { uuid },
      select: {
        mealsPerDay: true,
        intermediateCustomerMedicalConditions: {
          select: { customerMedicalCondition: { select: { name: true } } },
        },
        intermediateCustomerNutritionNeeds: {
          where: {
            customerNutritionNeed: {
              OR: [
                { name: 'caloriePerMeal' },
                { name: 'fatPerMeal' },
                { name: 'proteinPerMeal' },
                { name: 'carbsPerMeal' },
              ],
            },
          },
          select: {
            nutritionValue: true,
            customerNutritionNeed: { select: { name: true } },
          },
        },
      },
    });

    const allConditions = response?.intermediateCustomerMedicalConditions
      ? response.intermediateCustomerMedicalConditions.map(
          ({ customerMedicalCondition }) => {
            return customerMedicalCondition.name;
          },
        )
      : [];
    const sodiumPerMeal = allConditions.includes('highBloodPressure')
      ? Math.round(1800 / (response?.mealsPerDay || 4))
      : Math.round(2100 / (response?.mealsPerDay || 4));

    let nutritions: NutritionNeed = {
      // Set the default values
      carbsPerMeal: 50,
      proteinPerMeal: 30,
      fatPerMeal: 20,
      caloriePerMeal: 400,
      sodiumPerMeal,
    };

    for (let {
      customerNutritionNeed,
      nutritionValue,
    } of response?.intermediateCustomerNutritionNeeds) {
      nutritions = {
        ...nutritions,
        [customerNutritionNeed.name]: nutritionValue,
      };
    }

    return [nutritions];
  }

  async updateCustomerEmailByUuid({
    uuid,
    newEmail,
  }: UpdateEmailByUuidArgs): Promise<[Customer?, Error?]> {
    const response = await this.prisma.customers.update({
      where: { uuid },
      data: { email: newEmail },
      select: { id: true },
    });
    return [{ id: response.id, email: newEmail, uuid }];
  }

  async getCustomerByUuid({
    uuid,
  }: GetCustomerByUuidArgs): Promise<[Customer?, Error?]> {
    const response = await this.prisma.customers.findUnique({
      where: { uuid },
      select: { id: true, email: true, uuid: true },
    });

    return [{ id: response.id, email: response.email, uuid: response.uuid }];
  }
  async getCustomerMedicalCondition({
    email,
  }: GetCustomerMedicalConditionArgs): Promise<
    [CustomerMedicalCondition?, Error?]
  > {
    const res = await this.prisma.customers.findUnique({
      where: { email },
      select: {
        id: true,
        uuid: true,
        intermediateCustomerMedicalConditions: {
          select: { customerMedicalCondition: { select: { name: true } } },
        },
      },
    });
    const { id, uuid } = res;
    const customerConditions = res?.intermediateCustomerMedicalConditions;

    const allConditions = customerConditions.length
      ? customerConditions.map((condition) => {
          return condition.customerMedicalCondition.name;
        })
      : [];

    return [
      {
        highBloodPressure: allConditions.includes('highBloodPressure'),
        highCholesterol: allConditions.includes('highCholesterol'),
        id,
        email,
        uuid,
      },
    ];
  }

  async getCustomerPreference({
    email,
    type,
  }: GetCustomerPreferenceArgs): Promise<[Preference?, Error?]> {
    let customerPreference: number[] = [];
    switch (type) {
      case 'flavorDislikes':
        await this.prisma.intermediateCustomerFlavorDislike
          .findMany({
            where: { customer: { email } },
            select: { productFlavorId: true },
          })
          .then((response) => {
            customerPreference = response.length
              ? response.map((flavor) => {
                  return flavor.productFlavorId;
                })
              : [];
          });
        break;
      case 'allergens':
        await this.prisma.intermediateCustomerAllergen
          .findMany({
            where: { customer: { email } },
            select: { productAllergenId: true },
          })
          .then((response) => {
            customerPreference = response.length
              ? response.map((allergen) => {
                  return allergen.productAllergenId;
                })
              : [];
          });
        break;
      case 'unavailableCookingMethods':
        await this.prisma.intermediateCustomerUnavailableCookingMethod
          .findMany({
            where: { customer: { email } },
            select: { productCookingMethodId: true },
          })
          .then((response) => {
            customerPreference = response.length
              ? response.map((cookingMethod) => {
                  return cookingMethod.productCookingMethodId;
                })
              : [];
          });
        break;
      case 'categoryPreferences':
        await this.prisma.intermediateCustomerCategoryPreference
          .findMany({
            where: { customer: { email } },
            select: { productCategoryId: true },
          })
          .then((response) => {
            customerPreference = response.length
              ? response.map((category) => {
                  return category.productCategoryId;
                })
              : [];
          });
        break;
      default:
        break;
    }

    return [{ id: customerPreference }];
  }

  async getCustomer({ email }: GetCustomerArgs): Promise<[Customer?, Error?]> {
    const response = await this.prisma.customers.findUnique({
      where: { email },
      select: { id: true, email: true, uuid: true },
    });
    if (!Object.keys(response).length) {
      return [{ id: undefined, email: undefined, uuid: undefined }];
    }

    return [{ id: response.id, email: response.email, uuid: response.uuid }];
  }
}

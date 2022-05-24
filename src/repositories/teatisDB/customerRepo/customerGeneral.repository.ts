import { Injectable } from '@nestjs/common';
import { assert } from 'console';
import { Customer } from '@Domains/Customer';
import { ProductNutrition } from '@Domains/Product';

import { PrismaService } from '../../../prisma.service';
import { Preference } from '@Domains/Preference';
import { Nutrition } from '@Domains/Nutrition';
import { MedicalCondition } from '@Domains/MedicalCondition';

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

export interface CustomerGeneralRepoInterface {
  getCustomer({ email }: GetCustomerArgs): Promise<[Customer?, Error?]>;
  getCustomerPreference({
    email,
  }: GetCustomerPreferenceArgs): Promise<[Preference?, Error?]>;
  getCustomerCondition({
    email,
  }: GetCustomerMedicalConditionArgs): Promise<[MedicalCondition?, Error?]>;
  getCustomerNutrition({
    uuid,
  }: GetCustomerNutritionArgs): Promise<[Nutrition?, Error?]>;
  getCustomerByUuid({
    uuid,
  }: GetCustomerByUuidArgs): Promise<[Customer?, Error?]>;

  updateEmailByUuid({
    uuid,
    newEmail,
  }: UpdateEmailByUuidArgs): Promise<[Customer?, Error?]>;
}

@Injectable()
export class CustomerGeneralRepo implements CustomerGeneralRepoInterface {
  constructor(private prisma: PrismaService) {}

  async getCustomerNutrition({
    uuid,
  }: GetCustomerNutritionArgs): Promise<[Nutrition?, Error?]> {
    try {
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

      let nutritions: Nutrition = {
        // Set the default values
        carbsPerMeal: 50,
        proteinPerMeal: 30,
        fatPerMeal: 20,
        caloriePerMeal: 400,
        sodiumPerMeal,
      };

      if (!response?.intermediateCustomerNutritionNeeds) {
        throw new Error();
      }
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
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getCustomerNutrition failed',
        },
      ];
    }
  }

  async updateEmailByUuid({
    uuid,
    newEmail,
  }: UpdateEmailByUuidArgs): Promise<[Customer?, Error?]> {
    try {
      const response = await this.prisma.customers.update({
        where: { uuid },
        data: { email: newEmail },
        select: { id: true },
      });
      return [{ id: response.id, email: newEmail, uuid }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: updateEmailByUuid failed',
        },
      ];
    }
  }

  async getCustomerByUuid({
    uuid,
  }: GetCustomerByUuidArgs): Promise<[Customer?, Error?]> {
    try {
      const response = await this.prisma.customers.findUnique({
        where: { uuid },
        select: { id: true, email: true, uuid: true },
      });

      if (!response?.email || !response?.id || !response.uuid) {
        throw new Error();
      }
      return [{ id: response.id, email: response.email, uuid: response.uuid }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getCustomerByUuid failed',
        },
      ];
    }
  }
  async getCustomerCondition({
    email,
  }: GetCustomerMedicalConditionArgs): Promise<[MedicalCondition?, Error?]> {
    try {
      const res = await this.prisma.customers.findUnique({
        where: { email },
        select: {
          intermediateCustomerMedicalConditions: {
            select: { customerMedicalCondition: { select: { name: true } } },
          },
        },
      });
      const customerConditions = res?.intermediateCustomerMedicalConditions;
      // assert(customerConditions !== undefined)
      const allConditions = customerConditions.length
        ? customerConditions.map((condition) => {
            return condition.customerMedicalCondition.name;
          })
        : [];

      return [
        {
          highBloodPressure: allConditions.includes('highBloodPressure'),
          highCholesterol: allConditions.includes('highCholesterol'),
        },
      ];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getCustomerCondition failed',
        },
      ];
    }
  }

  async getCustomerPreference({
    email,
    type,
  }: GetCustomerPreferenceArgs): Promise<[Preference?, Error?]> {
    try {
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
            })
            .catch((e) => {
              throw new Error();
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
            })
            .catch((e) => {
              throw new Error();
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
            })
            .catch((e) => {
              throw new Error();
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
            })
            .catch((e) => {
              throw new Error();
            });
          break;
        default:
          break;
      }

      return [{ id: customerPreference }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: `Server Side Error: get${type} failed`,
        },
      ];
    }
  }

  async getCustomer({ email }: GetCustomerArgs): Promise<[Customer?, Error?]> {
    try {
      const response = await this.prisma.customers.findUnique({
        where: { email },
        select: { id: true, email: true, uuid: true },
      });
      if (!response?.email || !response?.id || !response?.uuid) {
        throw new Error();
      }
      return [{ id: response.id, email: response.email, uuid: response.uuid }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getCustomer failed',
        },
      ];
    }
  }
}

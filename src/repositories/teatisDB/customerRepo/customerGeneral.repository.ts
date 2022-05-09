import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';

export interface GetCustomerArgs {
  email: string;
}

export interface GetCustomerRes {
  id: number;
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

interface GetCustomerPreferenceRes {
  ids: number[];
}

interface GetCustomerByUuidArgs {
  uuid: string;
}

interface GetCustomerByUuidRes {
  id: number;
  email: string;
}

interface GetCustomerMedicalConditionArgs {
  email: string;
}

interface GetCustomerMedicalConditionRes {
  highBloodPressure: boolean;
  highCholesterol: boolean;
}

interface UpdateEmailByUuidArgs {
  uuid: string;
  newEmail: string;
}

interface UpdateEmailByUuidRes {
  id: number;
}

interface GetCustomerNutritionArgs {
  uuid: string;
}

interface GetCustomerNutritionRes {
  carbsPerMeal: number;
  proteinPerMeal: number;
  fatPerMeal: number;
  sodiumPerMeal: number;
  caloriePerMeal: number;
}

export interface CustomerGeneralRepoInterface {
  getCustomer({ email }: GetCustomerArgs): Promise<[GetCustomerRes?, Error?]>;
  getCustomerPreference({
    email,
  }: GetCustomerPreferenceArgs): Promise<[GetCustomerPreferenceRes?, Error?]>;
  getCustomerCondition({
    email,
  }: GetCustomerMedicalConditionArgs): Promise<
    [GetCustomerMedicalConditionRes?, Error?]
  >;
  getCustomerNutrition({
    uuid,
  }: GetCustomerNutritionArgs): Promise<[GetCustomerNutritionRes?, Error?]>;
  getCustomerByUuid({
    uuid,
  }: GetCustomerByUuidArgs): Promise<[GetCustomerByUuidRes?, Error?]>;

  updateEmailByUuid({
    uuid,
    newEmail,
  }: UpdateEmailByUuidArgs): Promise<[UpdateEmailByUuidRes?, Error?]>;
}

@Injectable()
export class CustomerGeneralRepo implements CustomerGeneralRepoInterface {
  constructor(private prisma: PrismaService) {}

  async getCustomerNutrition({
    uuid,
  }: GetCustomerNutritionArgs): Promise<[GetCustomerNutritionRes?, Error?]> {
    try {
      const res = await this.prisma.customers.findUnique({
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

      const allConditions = res?.intermediateCustomerMedicalConditions
        ? res.intermediateCustomerMedicalConditions.map(
            ({ customerMedicalCondition }) => {
              return customerMedicalCondition.name;
            },
          )
        : [];
      const sodiumPerMeal = allConditions.includes('highBloodPressure')
        ? Math.round(1800 / (res?.mealsPerDay || 4))
        : Math.round(2100 / (res?.mealsPerDay || 4));

      let nutritions: GetCustomerNutritionRes = {
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
      } of res.intermediateCustomerNutritionNeeds) {
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
  }: UpdateEmailByUuidArgs): Promise<[UpdateEmailByUuidRes?, Error?]> {
    try {
      const res = await this.prisma.customers.update({
        where: { uuid },
        data: { email: newEmail },
      });
      return [{ id: res.id }];
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
  }: GetCustomerByUuidArgs): Promise<[GetCustomerByUuidRes?, Error?]> {
    try {
      const res = await this.prisma.customers.findUnique({
        where: { uuid },
        select: { id: true, email: true },
      });

      if (!res.email || !res.id) {
        throw new Error();
      }
      return [{ id: res.id, email: res.email }];
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
  }: GetCustomerMedicalConditionArgs): Promise<
    [GetCustomerMedicalConditionRes?, Error?]
  > {
    try {
      const res = await this.prisma.customers.findUnique({
        where: { email },
        select: {
          intermediateCustomerMedicalConditions: {
            select: { customerMedicalCondition: { select: { name: true } } },
          },
        },
      });
      const allConditions =
        res.intermediateCustomerMedicalConditions.length > 0
          ? res.intermediateCustomerMedicalConditions.map((condition) => {
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
  }: GetCustomerPreferenceArgs): Promise<[GetCustomerPreferenceRes?, Error?]> {
    try {
      let customerPreference: number[] = [];
      switch (type) {
        case 'flavorDislikes':
          await this.prisma.intermediateCustomerFlavorDislike
            .findMany({
              where: { customer: { email } },
              select: { productFlavorId: true },
            })
            .then((res) => {
              customerPreference = res.length
                ? res.map((flavor) => {
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
            .then((res) => {
              customerPreference = res.length
                ? res.map((allergen) => {
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
            .then((res) => {
              customerPreference = res.length
                ? res.map((coolingMethod) => {
                    return coolingMethod.productCookingMethodId;
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
            .then((res) => {
              customerPreference = res.length
                ? res.map((category) => {
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

      return [{ ids: customerPreference }];
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

  async getCustomer({
    email,
  }: GetCustomerArgs): Promise<[GetCustomerRes?, Error?]> {
    try {
      const res = await this.prisma.customers.findUnique({
        where: { email },
        select: { id: true, email: true },
      });

      if (!res?.email || !res?.id) {
        throw new Error();
      }
      return [{ id: res.id, email: res.email }, null];
    } catch (e) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getCustomer failed',
        },
      ];
    }
  }
}

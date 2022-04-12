import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma.service';

interface GetCustomerArgs {
  email: string;
}

interface GetCustomerRes {
  id: number;
  email: string;
}

interface GetCustomerPreferenceArgs {
  type:
    | 'flavorDislikes'
    | 'allergens'
    | 'unavailableCookingMethods'
    | 'categoryLikes';
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

export interface CustomerGeneralRepoInterface {
  getCustomer({ email }: GetCustomerArgs): Promise<[GetCustomerRes, Error]>;
  getCustomerPreference({
    email,
  }: GetCustomerPreferenceArgs): Promise<[GetCustomerPreferenceRes, Error]>;
  getCustomerCondition({
    email,
  }: GetCustomerMedicalConditionArgs): Promise<
    [GetCustomerMedicalConditionRes, Error]
  >;
  getCustomerByUuid({
    uuid,
  }: GetCustomerByUuidArgs): Promise<[GetCustomerByUuidRes, Error]>;
}

@Injectable()
export class CustomerGeneralRepo implements CustomerGeneralRepoInterface {
  constructor(private prisma: PrismaService) {}
  async getCustomerByUuid({
    uuid,
  }: GetCustomerByUuidArgs): Promise<[GetCustomerByUuidRes, Error]> {
    let customer = await this.prisma.customers.findUnique({
      where: { uuid },
      select: { id: true, email: true },
    });

    if (!customer?.email || !customer?.id) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getCustomerByUuid failed',
        },
      ];
    }
    return [{ id: customer.id, email: customer.email }, null];
  }
  async getCustomerCondition({
    email,
  }: GetCustomerMedicalConditionArgs): Promise<
    [GetCustomerMedicalConditionRes, Error]
  > {
    const getCustomerConditoinRes = await this.prisma.customers.findMany({
      where: { email },
      select: {
        intermediateCustomerMedicalConditions: {
          select: { customerMedicalCondition: { select: { name: true } } },
        },
      },
    });
    const allConditions = getCustomerConditoinRes[0]
      ? getCustomerConditoinRes[0].intermediateCustomerMedicalConditions.map(
          (condition) => {
            return condition.customerMedicalCondition.name;
          },
        )
      : [];

    return [
      {
        highBloodPressure: allConditions.includes('highBloodPressure'),
        highCholesterol: allConditions.includes('highCholesterol'),
      },
      null,
    ];
  }

  async getCustomerPreference({
    email,
    type,
  }: GetCustomerPreferenceArgs): Promise<[GetCustomerPreferenceRes, Error]> {
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
              customerPreference = res.map((flavor) => {
                return flavor.productFlavorId;
              });
            })
            .catch((e) => {
              throw new Error(e);
            });
          break;
        case 'allergens':
          await this.prisma.intermediateCustomerAllergen
            .findMany({
              where: { customer: { email } },
              select: { productAllergenId: true },
            })
            .then((res) => {
              customerPreference = res.map((allergen) => {
                return allergen.productAllergenId;
              });
            })
            .catch((e) => {
              throw new Error(e);
            });
          break;
        case 'unavailableCookingMethods':
          await this.prisma.intermediateCustomerUnavailableCookingMethod
            .findMany({
              where: { customer: { email } },
              select: { productCookingMethodId: true },
            })
            .then((res) => {
              customerPreference = res.map((coolingMethod) => {
                return coolingMethod.productCookingMethodId;
              });
            })
            .catch((e) => {
              throw new Error(e);
            });
          break;
        case 'categoryLikes':
          await this.prisma.intermediateCustomerCategoryPreference
            .findMany({
              where: { customer: { email } },
              select: { productCategoryId: true },
            })
            .then((res) => {
              customerPreference = res.map((category) => {
                return category.productCategoryId;
              });
            })
            .catch((e) => {
              throw new Error(e);
            });
          break;
        default:
          break;
      }

      return [{ ids: customerPreference }, null];
    } catch (e) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: `Backend Error: get${type} failed`,
        },
      ];
    }
  }

  async getCustomer({
    email,
  }: GetCustomerArgs): Promise<[GetCustomerRes, Error]> {
    let customer = await this.prisma.customers.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!customer?.email || !customer?.id) {
      return [
        null,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: getCustomer failed',
        },
      ];
    }
    return [{ id: customer.id, email: customer.email }, null];
  }
}

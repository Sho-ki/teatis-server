import { Injectable } from '@nestjs/common';
import { Prisma, Discoveries, Customers } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';

export interface DiscoveriesRepoInterface {
  checkIfExists(typeform_id: string): Promise<boolean>;
  createDiscovery(data: Prisma.CustomersCreateInput): Promise<Customers>;
  retrieveAllCustomerNutritionItems(): Promise<Object>;
}

@Injectable()
export class DiscoveriesRepo implements DiscoveriesRepoInterface {
  constructor(private prisma: PrismaService) {}

  async checkIfExists(email: string): Promise<boolean> {
    const findDiscoveryByTypeformId = await this.prisma.customers.findMany({
      where: { email },
    });

    return findDiscoveryByTypeformId.length ? true : false;
  }

  async retrieveAllCustomerNutritionItems(): Promise<Object> {
    const allCustomerNutritionNeeds =
      await this.prisma.customerNutritionNeed.findMany({
        select: { id: true, label: true },
      });
    let allCustomerNutritionNeedsObj = {};
    allCustomerNutritionNeeds.map((allCustomerNutritionNeed) => {
      allCustomerNutritionNeedsObj[allCustomerNutritionNeed.label] =
        allCustomerNutritionNeed.id;
    });
    return allCustomerNutritionNeedsObj;
  }

  async createDiscovery({
    email,
    BMR,
    carbsMacronutrients,
    proteinMacronutrients,
    fatMacronutrients,
    carbsPerMeal,
    proteinPerMeal,
    fatPerMeal,
    caloriePerMeal,
    retrieveAllCustomerNutritionItems,
  }): Promise<Customers> {
    const data: Prisma.CustomersCreateInput = {
      email,
      intermediateCustomerNutritionNeeds: {
        create: [
          {
            customerNutritionNeed: {
              connect: {
                id: retrieveAllCustomerNutritionItems['BMR'],
              },
            },
            nutritionValue: BMR,
          },
          {
            customerNutritionNeed: {
              connect: {
                id: retrieveAllCustomerNutritionItems['carbs_macronutrients'],
              },
            },
            nutritionValue: carbsMacronutrients,
          },
          {
            customerNutritionNeed: {
              connect: {
                id: retrieveAllCustomerNutritionItems['protein_macronutrients'],
              },
            },
            nutritionValue: proteinMacronutrients,
          },
          {
            customerNutritionNeed: {
              connect: {
                id: retrieveAllCustomerNutritionItems['fat_macronutrients'],
              },
            },
            nutritionValue: fatMacronutrients,
          },
          {
            customerNutritionNeed: {
              connect: {
                id: retrieveAllCustomerNutritionItems['carbs_per_meal'],
              },
            },
            nutritionValue: carbsPerMeal,
          },
          {
            customerNutritionNeed: {
              connect: {
                id: retrieveAllCustomerNutritionItems['protein_per_meal'],
              },
            },
            nutritionValue: proteinPerMeal,
          },
          {
            customerNutritionNeed: {
              connect: {
                id: retrieveAllCustomerNutritionItems['fat_per_meal'],
              },
            },
            nutritionValue: fatPerMeal,
          },
          {
            customerNutritionNeed: {
              connect: {
                id: retrieveAllCustomerNutritionItems['calorie_per_meal'],
              },
            },
            nutritionValue: caloriePerMeal,
          },
        ],
      },
    };

    return await this.prisma.customers.create({ data });
  }
}

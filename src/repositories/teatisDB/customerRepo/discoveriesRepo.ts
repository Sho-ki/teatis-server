import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Discoveries,
  Customer,
  CustomerNutritionItem,
} from '@prisma/client';
import { PrismaService } from '../../../prisma.service';

export interface DiscoveriesRepoInterface {
  checkIfExists(typeform_id: string): Promise<boolean>;
  createDiscovery(data: Prisma.CustomerCreateInput): Promise<Customer>;
  retrieveAllCustomerNutritionItems(): Promise<Object>;
}

@Injectable()
export class DiscoveriesRepo implements DiscoveriesRepoInterface {
  constructor(private prisma: PrismaService) {}

  async checkIfExists(email: string): Promise<boolean> {
    const findDiscoveryByTypeformId = await this.prisma.customer.findMany({
      where: { email },
    });

    return findDiscoveryByTypeformId.length ? true : false;
  }

  async retrieveAllCustomerNutritionItems(): Promise<Object> {
    const allCustomerNutritionItems =
      await this.prisma.customerNutritionItem.findMany({
        select: { id: true, label: true },
      });
    let allCustomerNutritionItemsObj = {};
    allCustomerNutritionItems.map((allCustomerNutritionItem) => {
      allCustomerNutritionItemsObj[allCustomerNutritionItem.label] =
        allCustomerNutritionItem.id;
    });
    return allCustomerNutritionItemsObj;
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
  }): Promise<Customer> {
    const data: Prisma.CustomerCreateInput = {
      email,
      customer_nutrition_items: {
        create: [
          {
            customer_nutrition_item: {
              connect: {
                id: retrieveAllCustomerNutritionItems['BMR'],
              },
            },
            nutrition_value: BMR,
          },
          {
            customer_nutrition_item: {
              connect: {
                id: retrieveAllCustomerNutritionItems['carbs_macronutrients'],
              },
            },
            nutrition_value: carbsMacronutrients,
          },
          {
            customer_nutrition_item: {
              connect: {
                id: retrieveAllCustomerNutritionItems['protein_macronutrients'],
              },
            },
            nutrition_value: proteinMacronutrients,
          },
          {
            customer_nutrition_item: {
              connect: {
                id: retrieveAllCustomerNutritionItems['fat_macronutrients'],
              },
            },
            nutrition_value: fatMacronutrients,
          },
          {
            customer_nutrition_item: {
              connect: {
                id: retrieveAllCustomerNutritionItems['carbs_per_meal'],
              },
            },
            nutrition_value: carbsPerMeal,
          },
          {
            customer_nutrition_item: {
              connect: {
                id: retrieveAllCustomerNutritionItems['protein_per_meal'],
              },
            },
            nutrition_value: proteinPerMeal,
          },
          {
            customer_nutrition_item: {
              connect: {
                id: retrieveAllCustomerNutritionItems['fat_per_meal'],
              },
            },
            nutrition_value: fatPerMeal,
          },
          {
            customer_nutrition_item: {
              connect: {
                id: retrieveAllCustomerNutritionItems['calorie_per_meal'],
              },
            },
            nutrition_value: caloriePerMeal,
          },
        ],
      },
    };
    return await this.prisma.customer.create({ data });
  }
}

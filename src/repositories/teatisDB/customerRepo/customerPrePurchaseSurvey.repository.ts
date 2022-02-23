import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

interface UpsertCustomerArgs {
  email: string;
  BMR: number;
  carbsMacronutrients: number;
  proteinMacronutrients: number;
  fatMacronutrients: number;
  carbsPerMeal: number;
  proteinPerMeal: number;
  fatPerMeal: number;
  caloriePerMeal: number;
}

export interface UpsertCustomerRes {
  customerId: number;
}

export interface CustomerPrePurchaseSurveyRepoInterface {
  upsertCustomer({
    email,
    BMR,
    carbsMacronutrients,
    proteinMacronutrients,
    fatMacronutrients,
    carbsPerMeal,
    proteinPerMeal,
    fatPerMeal,
    caloriePerMeal,
  }: UpsertCustomerArgs): Promise<UpsertCustomerRes>;
}

@Injectable()
export class CustomerPrePurchaseSurveyRepo
  implements CustomerPrePurchaseSurveyRepoInterface
{
  constructor(private prisma: PrismaService) {}

  async upsertCustomer({
    email,
    BMR,
    carbsMacronutrients,
    proteinMacronutrients,
    fatMacronutrients,
    carbsPerMeal,
    proteinPerMeal,
    fatPerMeal,
    caloriePerMeal,
  }: UpsertCustomerArgs): Promise<UpsertCustomerRes> {
    const customer = await this.prisma.customers.upsert({
      where: { email },
      create: {
        email,
        intermediateCustomerNutritionNeeds: {
          create: [
            {
              nutritionValue: BMR,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { label: 'BMR' },
                  create: { label: 'BMR', description: 'BMR' },
                },
              },
            },
            {
              nutritionValue: carbsMacronutrients,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { label: 'carbs_macronutrients' },
                  create: {
                    label: 'carbs_macronutrients',
                    description: 'carbs_macronutrients',
                  },
                },
              },
            },
            {
              nutritionValue: proteinMacronutrients,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { label: 'protein_macronutrients' },
                  create: {
                    label: 'protein_macronutrients',
                    description: 'protein_macronutrients',
                  },
                },
              },
            },
            {
              nutritionValue: fatMacronutrients,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { label: 'fat_macronutrients' },
                  create: {
                    label: 'fat_macronutrients',
                    description: 'fat_macronutrients',
                  },
                },
              },
            },
            {
              nutritionValue: carbsPerMeal,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { label: 'carbs_per_meal' },
                  create: {
                    label: 'carbs_per_meal',
                    description: 'carbs_per_meal',
                  },
                },
              },
            },
            {
              nutritionValue: proteinPerMeal,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { label: 'protein_per_meal' },
                  create: {
                    label: 'protein_per_meal',
                    description: 'protein_per_meal',
                  },
                },
              },
            },
            {
              nutritionValue: fatPerMeal,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { label: 'fat_per_meal' },
                  create: {
                    label: 'fat_per_meal',
                    description: 'fat_per_meal',
                  },
                },
              },
            },
            {
              nutritionValue: caloriePerMeal,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { label: 'calorie_per_meal' },
                  create: {
                    label: 'calorie_per_meal',
                    description: 'calorie_per_meal',
                  },
                },
              },
            },
          ],
        },
      },
      update: {},
    });

    return { customerId: customer.id };
  }
}

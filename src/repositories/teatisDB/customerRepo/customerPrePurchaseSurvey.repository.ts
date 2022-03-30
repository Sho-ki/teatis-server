import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';

interface UpsertCustomerArgs {
  diabetes: string;
  uuid: string;
  height: number;
  weight: number;
  age: number;
  gender?: string;
  medicalConditions: { name: string; label: string }[];
  activeLevel: string;
  A1c: string;
  mealsPerDay: number;
  categoryPreferences: { name: string; label: string }[];
  flavorDislikes: { name: string; label: string }[];
  ingredientDislikes: { name: string; label: string }[];
  allergens: { name: string; label: string }[];
  email: string;
  unavailableCookingMethods: { name: string; label: string }[];
  BMR: number;
  carbsMacronutrients: number;
  proteinMacronutrients: number;
  fatMacronutrients: number;
  carbsPerMeal: number;
  proteinPerMeal: number;
  fatPerMeal: number;
  caloriePerMeal: number;
}

interface UpsertCustomerRes {
  customerId: number;
  customerUuid: string;
}

export interface CustomerPrePurchaseSurveyRepoInterface {
  upsertCustomer({
    uuid,
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
    BMR,
    carbsMacronutrients,
    proteinMacronutrients,
    fatMacronutrients,
    carbsPerMeal,
    proteinPerMeal,
    fatPerMeal,
    caloriePerMeal,
  }: UpsertCustomerArgs): Promise<[UpsertCustomerRes, Error]>;
}

@Injectable()
export class CustomerPrePurchaseSurveyRepo
  implements CustomerPrePurchaseSurveyRepoInterface
{
  constructor(private prisma: PrismaService) {}

  async upsertCustomer({
    uuid,
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
    BMR,
    carbsMacronutrients,
    proteinMacronutrients,
    fatMacronutrients,
    carbsPerMeal,
    proteinPerMeal,
    fatPerMeal,
    caloriePerMeal,
  }: UpsertCustomerArgs): Promise<[UpsertCustomerRes, Error]> {
    let medicalConditionsQuery = [
      {
        medicalConditionValue: A1c,
        customerMedicalCondition: {
          connectOrCreate: {
            where: { name: 'A1c' },
            create: { name: 'A1c', label: 'A1c' },
          },
        },
      },
      {
        medicalConditionValue: diabetes,
        customerMedicalCondition: {
          connectOrCreate: {
            where: { name: 'diabetes' },
            create: { name: 'diabetes', label: 'Diabetes' },
          },
        },
      },
    ];

    for (let medicalCondition of medicalConditions) {
      medicalConditionsQuery.push({
        medicalConditionValue: 'yes',
        customerMedicalCondition: {
          connectOrCreate: {
            where: { name: medicalCondition.name },
            create: {
              name: medicalCondition.name,
              label: medicalCondition.label,
            },
          },
        },
      });
    }

    const checkIfExists = await this.prisma.customers.findUnique({
      where: { email },
    });

    if (checkIfExists) {
      await Promise.all([
        this.prisma.intermediateCustomerCategoryPreference.deleteMany({
          where: { customerId: checkIfExists.id },
        }),
        this.prisma.intermediateCustomerIngredientDislike.deleteMany({
          where: { customerId: checkIfExists.id },
        }),
        this.prisma.intermediateCustomerAllergen.deleteMany({
          where: { customerId: checkIfExists.id },
        }),
        this.prisma.intermediateCustomerFlavorDislike.deleteMany({
          where: { customerId: checkIfExists.id },
        }),
        this.prisma.intermediateCustomerUnavailableCookingMethod.deleteMany({
          where: { customerId: checkIfExists.id },
        }),
        this.prisma.intermediateCustomerMedicalCondition.deleteMany({
          where: { customerId: checkIfExists.id },
        }),
        this.prisma.intermediateCustomerNutritionNeed.deleteMany({
          where: { customerId: checkIfExists.id },
        }),
      ]);
    }

    let customer = await this.prisma.customers.upsert({
      where: { email },
      select: {
        id: true,
        uuid: true,
      },
      create: {
        uuid,
        email,
        age,
        gender,
        heightCm: height,
        weightKg: weight,
        activeLevel,
        mealsPerDay,
        intermediateCustomerCategoryPreferences:
          categoryPreferences.length > 0
            ? {
                create: categoryPreferences.map((categoryPreference) => {
                  return {
                    productCategory: {
                      connectOrCreate: {
                        where: { name: categoryPreference.name },
                        create: {
                          name: categoryPreference.name,
                          label: categoryPreference.label,
                        },
                      },
                    },
                  };
                }),
              }
            : {},
        intermediateCustomerIngredientDislikes:
          ingredientDislikes.length > 0
            ? {
                create: ingredientDislikes.map((ingredientDislike) => {
                  return {
                    productIngredient: {
                      connectOrCreate: {
                        where: { name: ingredientDislike.name },
                        create: {
                          name: ingredientDislike.name,
                          label: ingredientDislike.label,
                        },
                      },
                    },
                  };
                }),
              }
            : {},

        intermediateCustomerAllergens:
          allergens.length > 0
            ? {
                create: allergens.map((allergen) => {
                  return {
                    productAllergen: {
                      connectOrCreate: {
                        where: { name: allergen.name },
                        create: {
                          name: allergen.name,
                          label: allergen.label,
                        },
                      },
                    },
                  };
                }),
              }
            : {},
        intermediateCustomerFlavorDislikes:
          flavorDislikes.length > 0
            ? {
                create: flavorDislikes.map((flavorDislike) => {
                  return {
                    productFlavor: {
                      connectOrCreate: {
                        where: { name: flavorDislike.name },
                        create: {
                          name: flavorDislike.name,
                          label: flavorDislike.label,
                        },
                      },
                    },
                  };
                }),
              }
            : {},
        intermediateCustomerUnavailableCookingMethods:
          unavailableCookingMethods.length > 0
            ? {
                create: unavailableCookingMethods.map(
                  (unavailableCookingMethod) => {
                    return {
                      productCookingMethod: {
                        connectOrCreate: {
                          where: { name: unavailableCookingMethod.name },
                          create: {
                            name: unavailableCookingMethod.name,
                            label: unavailableCookingMethod.label,
                          },
                        },
                      },
                    };
                  },
                ),
              }
            : {},
        intermediateCustomerMedicalConditions: {
          create: medicalConditionsQuery,
        },
        intermediateCustomerNutritionNeeds: {
          create: [
            {
              nutritionValue: BMR,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'BMR' },
                  create: { label: 'BMR', name: 'BMR' },
                },
              },
            },
            {
              nutritionValue: carbsMacronutrients,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'carbsMacronutrients' },
                  create: {
                    label: 'Carbs Macronutrients',
                    name: 'carbsMacronutrients',
                  },
                },
              },
            },
            {
              nutritionValue: proteinMacronutrients,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'proteinMacronutrients' },
                  create: {
                    label: 'Protein Macronutrients',
                    name: 'proteinMacronutrients',
                  },
                },
              },
            },
            {
              nutritionValue: fatMacronutrients,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'fatMacronutrients' },
                  create: {
                    label: 'Fat Macronutrients',
                    name: 'fatMacronutrients',
                  },
                },
              },
            },
            {
              nutritionValue: carbsPerMeal,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'carbsPerMeal' },
                  create: {
                    name: 'carbsPerMeal',
                    label: 'Carbs Per Meal',
                  },
                },
              },
            },
            {
              nutritionValue: proteinPerMeal,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'proteinPerMeal' },
                  create: {
                    name: 'proteinPerMeal',
                    label: 'Protein Per Meal',
                  },
                },
              },
            },
            {
              nutritionValue: fatPerMeal,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'fatPerMeal' },
                  create: {
                    name: 'fatPerMeal',
                    label: 'Fat Per Meal',
                  },
                },
              },
            },
            {
              nutritionValue: caloriePerMeal,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'caloriePerMeal' },
                  create: {
                    name: 'caloriePerMeal',
                    label: 'Calorie Per Meal',
                  },
                },
              },
            },
          ],
        },
      },
      update: {
        age,
        gender,
        heightCm: height,
        weightKg: weight,
        activeLevel,
        mealsPerDay,
        intermediateCustomerCategoryPreferences:
          categoryPreferences.length > 0
            ? {
                create: categoryPreferences.map((categoryPreference) => {
                  return {
                    productCategory: {
                      connectOrCreate: {
                        where: { name: categoryPreference.name },
                        create: {
                          name: categoryPreference.name,
                          label: categoryPreference.label,
                        },
                      },
                    },
                  };
                }),
              }
            : {},
        intermediateCustomerIngredientDislikes:
          ingredientDislikes.length > 0
            ? {
                create: ingredientDislikes.map((ingredientDislike) => {
                  return {
                    productIngredient: {
                      connectOrCreate: {
                        where: { name: ingredientDislike.name },
                        create: {
                          name: ingredientDislike.name,
                          label: ingredientDislike.label,
                        },
                      },
                    },
                  };
                }),
              }
            : {},

        intermediateCustomerAllergens:
          allergens.length > 0
            ? {
                create: allergens.map((allergen) => {
                  return {
                    productAllergen: {
                      connectOrCreate: {
                        where: { name: allergen.name },
                        create: {
                          name: allergen.name,
                          label: allergen.label,
                        },
                      },
                    },
                  };
                }),
              }
            : {},
        intermediateCustomerFlavorDislikes:
          flavorDislikes.length > 0
            ? {
                create: flavorDislikes.map((flavorDislike) => {
                  return {
                    productFlavor: {
                      connectOrCreate: {
                        where: { name: flavorDislike.name },
                        create: {
                          name: flavorDislike.name,
                          label: flavorDislike.label,
                        },
                      },
                    },
                  };
                }),
              }
            : {},
        intermediateCustomerUnavailableCookingMethods:
          unavailableCookingMethods.length > 0
            ? {
                create: unavailableCookingMethods.map(
                  (unavailableCookingMethod) => {
                    return {
                      productCookingMethod: {
                        connectOrCreate: {
                          where: { name: unavailableCookingMethod.name },
                          create: {
                            name: unavailableCookingMethod.name,
                            label: unavailableCookingMethod.label,
                          },
                        },
                      },
                    };
                  },
                ),
              }
            : {},
        intermediateCustomerMedicalConditions: {
          create: medicalConditionsQuery,
        },
        intermediateCustomerNutritionNeeds: {
          create: [
            {
              nutritionValue: BMR,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'BMR' },
                  create: { label: 'BMR', name: 'BMR' },
                },
              },
            },
            {
              nutritionValue: carbsMacronutrients,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'carbsMacronutrients' },
                  create: {
                    label: 'Carbs Macronutrients',
                    name: 'carbsMacronutrients',
                  },
                },
              },
            },
            {
              nutritionValue: proteinMacronutrients,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'proteinMacronutrients' },
                  create: {
                    label: 'Protein Macronutrients',
                    name: 'proteinMacronutrients',
                  },
                },
              },
            },
            {
              nutritionValue: fatMacronutrients,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'fatMacronutrients' },
                  create: {
                    label: 'Fat Macronutrients',
                    name: 'fatMacronutrients',
                  },
                },
              },
            },
            {
              nutritionValue: carbsPerMeal,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'carbsPerMeal' },
                  create: {
                    name: 'carbsPerMeal',
                    label: 'Carbs Per Meal',
                  },
                },
              },
            },
            {
              nutritionValue: proteinPerMeal,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'proteinPerMeal' },
                  create: {
                    name: 'proteinPerMeal',
                    label: 'Protein Per Meal',
                  },
                },
              },
            },
            {
              nutritionValue: fatPerMeal,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'fatPerMeal' },
                  create: {
                    name: 'fatPerMeal',
                    label: 'Fat Per Meal',
                  },
                },
              },
            },
            {
              nutritionValue: caloriePerMeal,
              customerNutritionNeed: {
                connectOrCreate: {
                  where: { name: 'caloriePerMeal' },
                  create: {
                    name: 'caloriePerMeal',
                    label: 'Calorie Per Meal',
                  },
                },
              },
            },
          ],
        },
      },
    });

    return [{ customerId: customer.id, customerUuid: customer.uuid }, null];
  }
}

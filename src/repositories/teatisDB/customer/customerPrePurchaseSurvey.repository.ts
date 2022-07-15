import { Injectable } from '@nestjs/common';
import { Customer } from '@Domains/Customer';
import { PrismaService } from '../../../prisma.service';

interface UpsertCustomerArgs {
  diabetes: string;
  uuid: string;
  height: number;
  weight: number;
  age: number;
  gender?: string;
  medicalConditions: { name: string; label?: string }[];
  activeLevel: string;
  A1c: string;
  mealsPerDay: number;
  categoryPreferences: { name: string; label?: string }[];
  flavorDislikes: { name: string; label?: string }[];
  ingredientDislikes: { name: string; label?: string }[];
  allergens: { name: string; label?: string }[];
  email: string;
  unavailableCookingMethods: { name: string; label?: string }[];
  BMR: number;
  carbsMacronutrients: number;
  proteinMacronutrients: number;
  fatMacronutrients: number;
  carbsPerMeal: number;
  proteinPerMeal: number;
  fatPerMeal: number;
  caloriePerMeal: number;
  boxPlan?: string[];
}

export interface CustomerPrePurchaseSurveyRepositoryInterface {
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
    boxPlan,
  }: UpsertCustomerArgs): Promise<[Customer?, Error?]>;
}

@Injectable()
export class CustomerPrePurchaseSurveyRepository
  implements CustomerPrePurchaseSurveyRepositoryInterface
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
    boxPlan,
  }: UpsertCustomerArgs): Promise<[Customer?, Error?]> {
    try {
      let medicalConditionsQuery = [
        {
          medicalConditionValue: A1c,
          customerMedicalCondition: {
            connect: {
              name: 'A1c',
            },
          },
        },
        {
          medicalConditionValue: diabetes,
          customerMedicalCondition: {
            connect: {
              name: 'diabetes',
            },
          },
        },
      ];

      for (let medicalCondition of medicalConditions) {
        medicalConditionsQuery.push({
          medicalConditionValue: 'yes',
          customerMedicalCondition: {
            connect: {
              name: medicalCondition.name,
            },
          },
        });
      }

      const checkIfExists = await this.prisma.customers.findUnique({
        where: { email },
      });

      // ToDo: Use CalculateAddedAndDeleted Function
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
          this.prisma.intermediateCustomerBoxPlan.deleteMany({
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
          intermediateCustomerBoxPlans:
            boxPlan?.length > 0
              ? {
                  create: boxPlan.map((name) => {
                    return {
                      customerBoxPlan: {
                        connect: {
                          name,
                        },
                      },
                    };
                  }),
                }
              : {},
          intermediateCustomerCategoryPreferences:
            categoryPreferences.length > 0
              ? {
                  create: categoryPreferences.map((categoryPreference) => {
                    return {
                      productCategory: {
                        connect: {
                          name: categoryPreference.name,
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
                        connect: {
                          name: ingredientDislike.name,
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
                        connect: {
                          name: allergen.name,
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
                        connect: {
                          name: flavorDislike.name,
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
                          connect: {
                            name: unavailableCookingMethod.name,
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
                  connect: {
                    name: 'BMR',
                  },
                },
              },
              {
                nutritionValue: carbsMacronutrients,
                customerNutritionNeed: {
                  connect: {
                    name: 'carbsMacronutrients',
                  },
                },
              },
              {
                nutritionValue: proteinMacronutrients,
                customerNutritionNeed: {
                  connect: {
                    name: 'proteinMacronutrients',
                  },
                },
              },
              {
                nutritionValue: fatMacronutrients,
                customerNutritionNeed: {
                  connect: {
                    name: 'fatMacronutrients',
                  },
                },
              },
              {
                nutritionValue: carbsPerMeal,
                customerNutritionNeed: {
                  connect: {
                    name: 'carbsPerMeal',
                  },
                },
              },
              {
                nutritionValue: proteinPerMeal,
                customerNutritionNeed: {
                  connect: {
                    name: 'proteinPerMeal',
                  },
                },
              },
              {
                nutritionValue: fatPerMeal,
                customerNutritionNeed: {
                  connect: {
                    name: 'fatPerMeal',
                  },
                },
              },
              {
                nutritionValue: caloriePerMeal,
                customerNutritionNeed: {
                  connect: {
                    name: 'caloriePerMeal',
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
          intermediateCustomerBoxPlans:
            boxPlan?.length > 0
              ? {
                  create: boxPlan.map((name) => {
                    return {
                      customerBoxPlan: {
                        connect: {
                          name,
                        },
                      },
                    };
                  }),
                }
              : {},
          intermediateCustomerCategoryPreferences:
            categoryPreferences.length > 0
              ? {
                  create: categoryPreferences.map((categoryPreference) => {
                    return {
                      productCategory: {
                        connect: {
                          name: categoryPreference.name,
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
                        connect: {
                          name: ingredientDislike.name,
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
                        connect: {
                          name: allergen.name,
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
                        connect: {
                          name: flavorDislike.name,
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
                          connect: {
                            name: unavailableCookingMethod.name,
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
                  connect: {
                    name: 'BMR',
                  },
                },
              },
              {
                nutritionValue: carbsMacronutrients,
                customerNutritionNeed: {
                  connect: {
                    name: 'carbsMacronutrients',
                  },
                },
              },
              {
                nutritionValue: proteinMacronutrients,
                customerNutritionNeed: {
                  connect: {
                    name: 'proteinMacronutrients',
                  },
                },
              },
              {
                nutritionValue: fatMacronutrients,
                customerNutritionNeed: {
                  connect: {
                    name: 'fatMacronutrients',
                  },
                },
              },
              {
                nutritionValue: carbsPerMeal,
                customerNutritionNeed: {
                  connect: {
                    name: 'carbsPerMeal',
                  },
                },
              },
              {
                nutritionValue: proteinPerMeal,
                customerNutritionNeed: {
                  connect: {
                    name: 'proteinPerMeal',
                  },
                },
              },
              {
                nutritionValue: fatPerMeal,
                customerNutritionNeed: {
                  connect: {
                    name: 'fatPerMeal',
                  },
                },
              },
              {
                nutritionValue: caloriePerMeal,
                customerNutritionNeed: {
                  connect: {
                    name: 'caloriePerMeal',
                  },
                },
              },
            ],
          },
        },
      });

      return [{ id: customer.id, uuid: customer.uuid, email }];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: upsertCustomer failed',
        },
      ];
    }
  }
}

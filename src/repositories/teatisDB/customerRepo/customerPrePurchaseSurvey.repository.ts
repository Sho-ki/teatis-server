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
  height: number;
  weight: number;
  age: number;
  gender: string;
  prePurchaseSurveyAnswer?: PrePurchaseSurveyAnswer;
}

interface PrePurchaseSurveyAnswer {
  diabetes?: string;
  gender?: string;
  medicalConditions?: string[];
  activeLevel?: string;
  A1c?: string;
  targetA1c?: string;
  foodPalate?: number;
  email?: string;
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
    height,
    weight,
    age,
    gender,
    prePurchaseSurveyAnswer,
  }: UpsertCustomerArgs): Promise<[UpsertCustomerRes, Error]>;
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
    height,
    weight,
    age,
    gender,
    prePurchaseSurveyAnswer,
  }: // prePurchaseSurveyAnswer
  UpsertCustomerArgs): Promise<[UpsertCustomerRes, Error]> {
    // // let medicalConditionsObj = {
    // //   highBloodPressure: cu.highBloodPressure,
    // //   heartDiseases: cu.heartDiseases,
    // //   highCholesterol: cu.highCholesterol,
    // //   gastritis: cu.gastritis,
    // //   irritableBowelSyndrome: cu.irritableBowelSyndrome,
    // //   chronicKidneyDisease: cu.chronicKidneyDisease,
    // //   gastroesophagealRefluxDisease: cu.gastroesophagealRefluxDisease,
    // //   anemia: cu.anemia,
    // //   hypothyroidism: cu.hypothyroidism,
    // //   hyperthyroidism: cu.hyperthyroidism,
    // // };

    // let diabetes: string = prePurchaseSurveyAnswer.diabetes;
    // if (
    //   !prePurchaseSurveyAnswer.diabetes ||
    //   prePurchaseSurveyAnswer.diabetes.includes('not')
    // ) {
    //   diabetes = 'unknown';
    // }
    // if (prePurchaseSurveyAnswer.diabetes.includes('love')) {
    //   diabetes = 'For A Loved One';
    // }

    // let a1c: string = prePurchaseSurveyAnswer.A1c;
    // if (!a1c || a1c.includes('know')) {
    //   a1c = 'unknown';
    // }

    // let targetA1c: string = prePurchaseSurveyAnswer.targetA1c;
    // if (!targetA1c || targetA1c.includes('know')) {
    //   targetA1c = 'unknown';
    // }

    // // let mediKeys = Object.keys(medicalConditionsObj);
    // // let filteredMediArr = mediKeys.filter((key) => {
    // //   return medicalConditionsObj[key] !== '';
    // // });
    // let mediQuery = [
    //   {
    //     medicalConditionValue: a1c,
    //     customerMedicalCondition: {
    //       connectOrCreate: {
    //         where: { name: 'A1c' },
    //         create: { name: 'A1c', label: 'A1c' },
    //       },
    //     },
    //   },
    //   {
    //     medicalConditionValue: targetA1c,
    //     customerMedicalCondition: {
    //       connectOrCreate: {
    //         where: { name: 'targetA1c' },
    //         create: { name: 'targetA1c', label: 'targetA1c' },
    //       },
    //     },
    //   },
    //   {
    //     medicalConditionValue: diabetes,
    //     customerMedicalCondition: {
    //       connectOrCreate: {
    //         where: { name: 'diabetes' },
    //         create: { name: 'diabetes', label: 'Diabetes' },
    //       },
    //     },
    //   },
    // ];
    // for (let medi of prePurchaseSurveyAnswer.medicalConditions) {
    //   mediQuery.push({
    //     medicalConditionValue: 'yes',
    //     customerMedicalCondition: {
    //       connectOrCreate: {
    //         where: { name: medi },
    //         create: { name: medi, label: medicalConditionsObj[medi] },
    //       },
    //     },
    //   });
    // }

    const customer = await this.prisma.customers.upsert({
      where: { email },
      create: {
        email,
        age,
        gender,
        heightCm: height,
        weightKg: weight,
        activeLevel: prePurchaseSurveyAnswer.activeLevel,
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
      update: {},
    });

    return [{ customerId: customer.id }, null];
  }
}

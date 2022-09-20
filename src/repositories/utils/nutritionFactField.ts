import { Prisma } from '@prisma/client';
import { NutritionFact } from '@Domains/NutritionFact';

export function nutritionFactField(
  productNutritionFact: Prisma.ProductNutritionFactCreateWithoutProductInput
): NutritionFact {
  const {
    calories, totalFatG, saturatedFatG,
    transFatG, cholesteroleMg, sodiumMg, totalCarbohydrateG, dietaryFiberG,
    totalSugarG, addedSugarG, sugarAlcoholG, proteinG,
  } = productNutritionFact;

  return {
    calorie: calories >= 0? calories : null,
    totalFat: totalFatG >= 0? totalFatG: null,
    saturatedFat: saturatedFatG  >= 0? saturatedFatG: null,
    transFat: transFatG >= 0? transFatG: null,
    cholesterole: cholesteroleMg >= 0?cholesteroleMg : null,
    sodium: sodiumMg >= 0? sodiumMg: null,
    totalCarbohydrate: totalCarbohydrateG >= 0?totalCarbohydrateG : null,
    dietaryFiber: dietaryFiberG >= 0? dietaryFiberG: null,
    totalSugar: totalSugarG >= 0?totalSugarG : null,
    sugarAlcohol: sugarAlcoholG >= 0? sugarAlcoholG: null,
    addedSugar: addedSugarG >= 0? addedSugarG: null,
    protein: proteinG >= 0? proteinG: null,
  };
}

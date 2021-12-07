export function calculatePerMeal(
  carbs: number,
  protein: number,
  fat: number,
  bmr: number,
) {
  return {
    carbsPerMeal: carbs * 0.25,
    proteinPerMeal: protein * 0.25,
    fatPerMeal: fat * 0.25,
    caloriePerMeal: bmr * 0.25,
  };
}

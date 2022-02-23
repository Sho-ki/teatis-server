export interface PrePurchaseSurveyResponse {
  a1c: string;
  a1cgoal: string;
  activelevel: string;
  age: number;
  diabetes: string;
  foodpalate: number;
  gender: string;
  height: number;
  medicalconditions: string;
  sweetorsavory: string;
  weight: number;
  allergies: string;
  tastePreferences: string[];
  email: string;
}

export type Step2Response = {
  carbsMacronutrients: number;
  proteinMacronutrients: number;
  fatMacronutrients: number;
};

export type Step3Response = {
  carbsPerMeal: number;
  proteinPerMeal: number;
  fatPerMeal: number;
  caloriePerMeal: number;
};

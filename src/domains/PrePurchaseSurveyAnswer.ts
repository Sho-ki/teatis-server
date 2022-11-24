export interface PrePurchaseSurveyAnswer{
    answerIdentifier:string;
    email: string;
    diabetes?: string;
    gender?: string;
    height?: number; // in cm
    weight?: number; // in kg
    age?: number;
    medicalConditions?: { name: string, label?: string }[];
    activeLevel?: string;
    A1c?: string;
    mealsPerDay?: number;
    categoryPreferences?: { name: string, label?: string }[];
    flavorDislikes?: { name: string, label?: string }[];
    ingredientDislikes?: { name: string, label?: string }[];
    allergens?: { name: string, label?: string }[];
    unavailableCookingMethods?: { name: string, label?: string }[];
    boxPlan?: string[];
}

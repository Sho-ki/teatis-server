export interface PrePurchaseSurveyAnswer{
    answerIdentifier:string;
    email: string;
    diabetes?: string;
    gender?: string;
    medicalConditions?: { name: string, label?: string }[];
    categoryPreferences?: { name: string, label?: string }[];
    flavorDislikes?: { name: string, label?: string }[];
    ingredientDislikes?: { name: string, label?: string }[];
    allergens?: { name: string, label?: string }[];
    unavailableCookingMethods?: { name: string, label?: string }[];
    boxPlan?: string[];
}

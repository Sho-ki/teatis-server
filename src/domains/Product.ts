export class Product {
  id: number;
  name: string;
  label: string;
  sku: string;
}

export class DisplayProduct extends Product {
  expertComment: string;
  ingredientLabel: string;
  images: ProductImage[];
  allergenLabel: string;
  nutritionFact: ProductNutrition;
  vendor: string;
}

export class AnalyzeProduct extends Product {
  vendor: string;
  flavor: ProductAddOn;
  category: ProductAddOn;
  allergens: ProductAddOn[];
  cookingMethods: ProductAddOn[];
}

export class DisplayAnalyzeProduct extends Product {
  expertComment: string;
  ingredientLabel: string;
  images: ProductImage[];
  allergenLabel: string;
  nutritionFact: ProductNutrition;
  vendor: string;
  flavor: ProductAddOn;
  category: ProductAddOn;
  allergens: ProductAddOn[];
  cookingMethods: ProductAddOn[];
}

export class FullProduct extends Product {
  expertComment: string;
  ingredientLabel: string;
  images: ProductImage[];
  flavor: ProductAddOn;
  category: ProductAddOn;
  allergens: ProductAddOn[];
  allergenLabel: string;
  foodTypes: ProductAddOn[];
  cookingMethods: ProductAddOn[];
  nutritionFact: ProductNutrition;
}

export class ProductAddOn {
  id?: number;
  name?: string;
  label?: string;
}

export class ProductImage {
  id?: number;
  src?: string;
  position?: number;
}

export class ProductNutrition {
  calorie: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  cholesterole: number;
  sodium: number;
  totalCarbohydrate: number;
  dietaryFiber: number;
  totalSugar: number;
  addedSugar: number;
  protein: number;
}

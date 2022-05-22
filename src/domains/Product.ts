import { NutritionFact } from './NutritionFact';

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
  nutritionFact: NutritionFact;
  vendor: string;
}

export class AnalyzeProduct extends Product {
  vendor: string;
  flavor: ProductAddOn;
  category: ProductAddOn;
  allergens: ProductAddOn[];
  cookingMethods: ProductAddOn[];
}

export class DisplayAnalyzeProduct
  implements Product, DisplayProduct, Omit<AnalyzeProduct, 'vendor'>
{
  id: number;
  name: string;
  label: string;
  sku: string;
  flavor: ProductAddOn;
  category: ProductAddOn;
  allergens: ProductAddOn[];
  cookingMethods: ProductAddOn[];
  expertComment: string;
  ingredientLabel: string;
  images: ProductImage[];
  allergenLabel: string;
  nutritionFact: NutritionFact;
  vendor: string;
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
  nutritionFact: NutritionFact;
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

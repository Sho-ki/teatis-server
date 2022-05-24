import { NutritionFact } from './NutritionFact';

export interface Product {
  id: number;
  name: string;
  label: string;
  sku: string;
}

export interface DisplayProduct extends Product {
  expertComment: string;
  ingredientLabel: string;
  images: ProductImage[];
  allergenLabel: string;
  nutritionFact: NutritionFact;
  vendor: string;
}

export interface AnalyzeProduct extends Product {
  vendor: string;
  flavor: ProductAddOn;
  category: ProductAddOn;
  allergens: ProductAddOn[];
  cookingMethods: ProductAddOn[];
}

export interface DisplayAnalyzeProduct
  extends Product,
    DisplayProduct,
    Omit<AnalyzeProduct, 'vendor'> {}

export interface FullProduct extends Product {
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

export interface ProductAddOn {
  id?: number;
  name?: string;
  label?: string;
}

export interface ProductImage {
  id?: number;
  src?: string;
  position?: number;
}

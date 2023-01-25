import { NutritionFact } from './NutritionFact';

export interface Product {
  id: number;
  name: string;
  label: string;
  sku: string;
}

export interface DisplayProduct extends Product {
  expertComment: string;
  glucoseValues?: number[];
  ingredientLabel: string;
  images: ProductImage[];
  allergenLabel: string;
  nutritionFact: NutritionFact;
  vendor: ProductFeature;
}

export interface AnalyzeProduct extends Product {
  vendor: ProductFeature;
  flavor: ProductFeature;
  category: ProductFeature;
  ingredients:  ProductFeature[];
  allergens: ProductFeature[];
  cookingMethods: ProductFeature[];
}

export interface DisplayAnalyzeProduct
  extends Product,
    Omit<DisplayProduct, 'vendor'>,
    AnalyzeProduct {}

export interface ProductFeature {
  id?: number;
  name?: string;
  label?: string;
  src?: string | null;
}

export interface ProductImage {
  id?: number;
  src?: string;
  position?: number;
}

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

export interface FullProduct extends Product {
  expertComment: string;
  ingredientLabel: string;
  images: ProductImage[];
  flavor: ProductFeature;
  category: ProductFeature;
  allergens: ProductFeature[];
  allergenLabel: string;
  foodTypes: ProductFeature[];
  ingredients:  ProductFeature[];
  cookingMethods: ProductFeature[];
  nutritionFact: NutritionFact;
}

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

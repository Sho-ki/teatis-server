import { ProductFeature } from './Product';

export interface ProductOptions {
  unavailableCookingMethods: ProductFeature[];
  allergens: ProductFeature[];
  ingredientDislikes: ProductFeature[];
  // foodType: ProductFeature[];
  flavorDislikes: ProductFeature[];
  categoryPreferences: ProductFeature[];
}

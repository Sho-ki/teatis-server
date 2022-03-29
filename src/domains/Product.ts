export class Product {
  id: number;
  name: string;
  label: string;
  sku: string;
  vendor: string;
  ingredientLabel: string;
  images: ProductImage[];
  flavor: ProductAddOn;
  category: ProductAddOn;
  allergens: ProductAddOn[];
  allergenLabel: string;
  foodTypes: ProductAddOn[];
  cookingMethods: ProductAddOn[];
  expertComment: string;
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
  calories: number;
  // TODO: add nutritions
}

export class Product {
  id: number;
  name: string;
  label: string;
  sku: string;
  vendor: ProductAddOn;
  images: ProductImage[];
  flavor: ProductAddOn;
  category: ProductAddOn;
  allergens: ProductAddOn[];
  foodTypes: ProductAddOn[];
  cookingMethods: ProductAddOn[];
  nutritionFact: ProductNutrition;
}

export class ProductAddOn {
  name: string;
  label: string;
}

export class ProductImage {
  src: string;
  position: number;
}

export class ProductNutrition {
  calories: number;
  // TODO: add nutritions
}

import { Inject, Injectable } from '@nestjs/common';

import { ProductGeneralRepoInterface } from '@Repositories/teatisDB/productRepo/productGeneral.repository';
import { ProductFeature } from '@Domains/Product';

export interface GetPrePurchaseOptionsUsecaseRes {
  unavailableCookingMethods: ProductFeature[];
  allergens: ProductFeature[];
  ingredientDislikes: ProductFeature[];
  // foodType: ProductFeature[];
  flavorDislikes: ProductFeature[];
  categoryPreferences: ProductFeature[];
}

export interface GetPrePurchaseOptionsUsecaseInterface {
  getPrePurchaseOptions(): Promise<[GetPrePurchaseOptionsUsecaseRes, Error]>;
}

@Injectable()
export class GetPrePurchaseOptionsUsecase
  implements GetPrePurchaseOptionsUsecaseInterface
{
  constructor(
    @Inject('ProductGeneralRepoInterface')
    private readonly productGeneralRepo: ProductGeneralRepoInterface,
  ) {}

  sortOptions(list: ProductFeature[]): ProductFeature[] {
    list.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else {
        return -1;
      }
    });
    return list;
  }

  async getPrePurchaseOptions(): Promise<
    [GetPrePurchaseOptionsUsecaseRes, Error]
  > {
    const [
      [cookingMethods, getCookMethodsError],
      [categories, getCategoriesError],
      [flavors, getFlavorsError],
      // [foodTypes, getFoodTypesError],
      [ingredients, getIngredientsError],
      [allergens, getAllergensError],
    ] = await Promise.all([
      this.productGeneralRepo.getOptions({ target: 'cookingMethod' }),
      this.productGeneralRepo.getOptions({ target: 'category' }),
      this.productGeneralRepo.getOptions({ target: 'flavor' }),
      // this.productGeneralRepo.getOptions({ target: 'foodType' }),
      this.productGeneralRepo.getOptions({ target: 'ingredient' }),
      this.productGeneralRepo.getOptions({ target: 'allergen' }),
    ]);

    if (getCookMethodsError) {
      return [null, getCookMethodsError];
    }
    if (getCategoriesError) {
      return [null, getCategoriesError];
    }
    if (getFlavorsError) {
      return [null, getFlavorsError];
    }
    // if (getFoodTypesError) {
    //   return [null, getFoodTypesError];
    // }
    if (getIngredientsError) {
      return [null, getIngredientsError];
    }
    if (getAllergensError) {
      return [null, getAllergensError];
    }

    return [
      {
        unavailableCookingMethods: [
          { id: 0, name: 'none', label: 'None' },
          ...this.sortOptions(cookingMethods),
        ],
        allergens: [
          { id: 0, name: 'none', label: 'None' },
          ...this.sortOptions(allergens),
        ],
        ingredientDislikes: this.sortOptions(ingredients),
        // foodType: [
        //   { id: 0, name: 'none', label: 'None' },
        //   ...this.sortOptions(foodTypes),
        // ],
        flavorDislikes: this.sortOptions(flavors),
        categoryPreferences: categories,
      },
      null,
    ];
  }
}

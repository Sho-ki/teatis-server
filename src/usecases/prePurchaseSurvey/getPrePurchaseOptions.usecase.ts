import { Inject, Injectable } from '@nestjs/common';

import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import { ProductFeature } from '@Domains/Product';
import { ReturnValueType } from '../../filter/customerError';
import { ProductOptions } from '../../domains/ProductOptions';

export interface GetPrePurchaseOptionsUsecaseInterface {
  getPrePurchaseOptions(): Promise<ReturnValueType<ProductOptions>>;
}

@Injectable()
export class GetPrePurchaseOptionsUsecase
implements GetPrePurchaseOptionsUsecaseInterface
{
  constructor(
    @Inject('ProductGeneralRepositoryInterface')
    private readonly productGeneralRepository: ProductGeneralRepositoryInterface,
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

  async getPrePurchaseOptions(): Promise<ReturnValueType<ProductOptions>>{
    const [
      [cookingMethods, getCookMethodsError],
      [categories, getCategoriesError],
      [flavors, getFlavorsError],
      // [foodTypes, getFoodTypesError],
      [ingredients, getIngredientsError],
      [allergens, getAllergensError],
    ] = await Promise.all([
      this.productGeneralRepository.getOptions({ target: 'cookingMethod' }),
      this.productGeneralRepository.getOptions({ target: 'category' }),
      this.productGeneralRepository.getOptions({ target: 'flavor' }),
      // this.productGeneralRepository.getOptions({ target: 'foodType' }),
      this.productGeneralRepository.getOptions({ target: 'ingredient' }),
      this.productGeneralRepository.getOptions({ target: 'allergen' }),
    ]);

    if (getCookMethodsError) {
      return [undefined, getCookMethodsError];
    }
    if (getCategoriesError) {
      return [undefined, getCategoriesError];
    }
    if (getFlavorsError) {
      return [undefined, getFlavorsError];
    }
    // if (getFoodTypesError) {
    //   return [undefined, getFoodTypesError];
    // }
    if (getIngredientsError) {
      return [undefined, getIngredientsError];
    }
    if (getAllergensError) {
      return [undefined, getAllergensError];
    }
    return [
      {
        unavailableCookingMethods: [{ id: 0, name: 'none', label: 'None' }, ...this.sortOptions(cookingMethods)],
        allergens: [{ id: 0, name: 'none', label: 'None' }, ...this.sortOptions(allergens)],
        ingredientDislikes: this.sortOptions(ingredients),
        // foodType: [
        //   { id: 0, name: 'none', label: 'None' },
        //   ...this.sortOptions(foodTypes),
        // ],
        flavorDislikes: this.sortOptions(flavors),
        categoryPreferences: categories,
      },
      undefined,
    ];
  }
}

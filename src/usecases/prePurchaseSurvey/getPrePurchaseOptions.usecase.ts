import { Inject, Injectable } from '@nestjs/common';

import { ProductGeneralRepoInterface } from 'src/repositories/teatisDB/productRepo/productGeneral.repository';

export interface GetPrePurchaseOptionsUsecaseRes {
  unavailableCookingMethods: Options[];
  allergens: Options[];
  ingredientDislikes: Options[];
  foodType: Options[];
  flavorDislikes: Options[];
  categoryPreferences: Options[];
}

interface Options {
  id: number;
  name: string;
  label: string;
  src?: string;
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

  async getPrePurchaseOptions(): Promise<
    [GetPrePurchaseOptionsUsecaseRes, Error]
  > {
    const [cookingMethods, getCookMethodsError] =
      await this.productGeneralRepo.getOptions({ target: 'cookingMethod' });
    if (getCookMethodsError) {
      return [null, getCookMethodsError];
    }
    const [categories, getCategoriesError] =
      await this.productGeneralRepo.getOptions({ target: 'category' });
    if (getCookMethodsError) {
      return [null, getCategoriesError];
    }
    const [flavors, getFlavorsError] = await this.productGeneralRepo.getOptions(
      { target: 'flavor' },
    );
    if (getCookMethodsError) {
      return [null, getFlavorsError];
    }
    const [foodTypes, getFoodTypesError] =
      await this.productGeneralRepo.getOptions({ target: 'foodType' });
    if (getCookMethodsError) {
      return [null, getFoodTypesError];
    }
    const [ingredients, getIngredientsError] =
      await this.productGeneralRepo.getOptions({ target: 'ingredient' });
    if (getCookMethodsError) {
      return [null, getIngredientsError];
    }
    const [allergens, getAllergensError] =
      await this.productGeneralRepo.getOptions({ target: 'allergen' });
    if (getCookMethodsError) {
      return [null, getAllergensError];
    }

    return [
      {
        unavailableCookingMethods: cookingMethods.option,
        allergens: allergens.option,
        ingredientDislikes: ingredients.option,
        foodType: foodTypes.option,
        flavorDislikes: flavors.option,
        categoryPreferences: categories.option,
      },
      null,
    ];
  }
}

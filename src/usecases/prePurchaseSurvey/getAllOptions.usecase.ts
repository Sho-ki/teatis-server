import { Inject, Injectable } from '@nestjs/common';

import { ProductGeneralRepoInterface } from 'src/repositories/teatisDB/productRepo/productGeneral.repository';

export interface GetAllOptionsUsecaseRes {
  cookingMethod: Options[];
  allergen: Options[];
  ingredient: Options[];
  foodType: Options[];
  flavor: Options[];
  category: Options[];
}

interface Options {
  id: number;
  name: string;
  label: string;
  src?: string;
}

export interface GetAllOptionsUsecaseInterface {
  getAllOptions(): Promise<[GetAllOptionsUsecaseRes, Error]>;
}

@Injectable()
export class GetAllOptionsUsecase implements GetAllOptionsUsecaseInterface {
  constructor(
    @Inject('ProductGeneralRepoInterface')
    private readonly productGeneralRepo: ProductGeneralRepoInterface,
  ) {}

  async getAllOptions(): Promise<[GetAllOptionsUsecaseRes, Error]> {
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
        cookingMethod: cookingMethods.option,
        category: categories.option,
        ingredient: flavors.option,
        foodType: foodTypes.option,
        flavor: ingredients.option,
        allergen: allergens.option,
      },
      null,
    ];
  }
}

import { Inject, Injectable } from '@nestjs/common';

import {
  GetProductRes as ShopifyGetProductRes,
  ShopifyRepoInterface,
} from '../../repositories/shopify/shopify.repository';
import { CustomerGeneralRepoInterface } from '../../repositories/teatisDB/customerRepo/customerGeneral.repository';
import {
  CustomerPrePurchaseSurveyRepoInterface,
  UpsertCustomerRes as TeatisDBUpsertCustomerRes,
} from '../../repositories/teatisDB/customerRepo/customerPrePurchaseSurvey.repository';
import { ProductGeneralRepoInterface } from '../../repositories/teatisDB/productRepo/productGeneral.repository';
import {
  GetCustomerAnsRes as TypeformGetCustomerAnsRes,
  TypeformRepoInterface,
} from '../../repositories/typeform/typeform.repository';

export interface GetAllOptionsUsecaseRes {
  cookMethod: Options[];
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
    const [cookMethods, getCookMethodsError] =
      await this.productGeneralRepo.getOptions({ target: 'cookMethod' });
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
        cookMethod: cookMethods.option,
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

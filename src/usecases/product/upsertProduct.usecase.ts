import { Inject, Injectable } from '@nestjs/common';

import { ProductGeneralRepoInterface } from '@Repositories/teatisDB/productRepo/productGeneral.repository';
import { UpsertProductDto } from '../../controllers/ops/product/dtos/upsertProduct';
import { Product } from '../../domains/Product';

export interface UpsertProductUsecaseInterface {
  upsertProduct({
    activeStatus,
    preservationStyle,
    allergenLabel,
    ingredientLabel,
    expertComment,
    WSP,
    MSP,
    label,
    name,
    productProviderId,
    upcCode,
    flavorId,
    categoryId,
    vendorId,
    externalSku,
    allergenIds,
    foodTypeIds,
    images,
    ingredientIds,
    cookingMethodIds,
    nutritionFact,
  }: UpsertProductDto): Promise<[Product?, Error?]>;
}

@Injectable()
export class UpsertProductUsecase implements UpsertProductUsecaseInterface {
  constructor(
    @Inject('ProductGeneralRepoInterface')
    private readonly productGeneralRepo: ProductGeneralRepoInterface,
  ) {}

  async upsertProduct({
    activeStatus,
    preservationStyle,
    allergenLabel,
    ingredientLabel,
    expertComment,
    WSP,
    MSP,
    label,
    name,
    productProviderId,
    upcCode,
    flavorId,
    categoryId,
    vendorId,
    externalSku,
    allergenIds: newProductAllergenIds,
    foodTypeIds: newProductFoodTypeIds,
    images: newProductImages,
    ingredientIds: newProductIngredientIds,
    cookingMethodIds: newProductCookingMethodIds,
    nutritionFact,
  }: UpsertProductDto): Promise<[Product?, Error?]> {
    try {
      const [product, upsertProductError] =
        await this.productGeneralRepo.upsertProduct({
          activeStatus,
          preservationStyle,
          allergenLabel,
          ingredientLabel,
          expertComment,
          WSP,
          MSP,
          label,
          name,
          productProviderId,
          upcCode,
          flavorId,
          categoryId,
          vendorId,
          externalSku,
          nutritionFact,
        });
      if (upsertProductError) {
        return [undefined, upsertProductError];
      }
      const [
        [updatedCookingMethods, upsertCookMethodsError],
        [updatedIngredients, upsertIngredientsError],
        [updatedAllergens, upsertAllergensError],
        [updatedFoodTypes, upsertFoodTypesError],
        [updatedImages, upsertImagesError],
      ] = await Promise.all([
        this.productGeneralRepo.upsertProductCookingMethodSet(
          newProductCookingMethodIds,
          product.id,
        ),
        this.productGeneralRepo.upsertProductIngredientSet(
          newProductIngredientIds,
          product.id,
        ),
        this.productGeneralRepo.upsertProductAllergenSet(
          newProductAllergenIds,
          product.id,
        ),
        this.productGeneralRepo.upsertProductFoodTypeSet(
          newProductFoodTypeIds,
          product.id,
        ),
        this.productGeneralRepo.upsertProductImageSet(
          newProductImages,
          product.id,
        ),
      ]);

      if (upsertCookMethodsError) {
        return [undefined, upsertCookMethodsError];
      }
      if (upsertIngredientsError) {
        return [undefined, upsertIngredientsError];
      }
      if (upsertAllergensError) {
        return [undefined, upsertAllergensError];
      }
      if (upsertFoodTypesError) {
        return [undefined, upsertFoodTypesError];
      }
      if (upsertImagesError) {
        return [undefined, upsertImagesError];
      }

      return [product];
    } catch (e) {
      return [
        undefined,
        {
          name: 'Internal Server Error',
          message: 'Server Side Error: UpsertProductUsecase failed',
        },
      ];
    }
  }
}

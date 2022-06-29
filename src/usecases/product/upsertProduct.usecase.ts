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
    allergenIds: newAllergenIds,
    foodTypeIds: newFoodTypeIds,
    images: newImages,
    ingredientIds: newIngredientIds,
    cookingMethodIds: newCookingMethodIds,
    nutritionFact,
  }: UpsertProductDto): Promise<[Product?, Error?]> {
    try {
      const [
        [existingCookingMethods, getCookMethodsError],
        [existingIngredients, getIngredientsError],
        [existingAllergens, getAllergensError],
        [existingFoodTypes, getFoodTypesError],
        [existingImages, getImagesError],
      ] = await Promise.all([
        this.productGeneralRepo.getExistingProductCookingMethods({
          externalSku,
        }),
        this.productGeneralRepo.getExistingProductIngredients({
          externalSku,
        }),
        this.productGeneralRepo.getExistingProductAllergens({
          externalSku,
        }),
        this.productGeneralRepo.getExistingProductFoodTypes({
          externalSku,
        }),
        this.productGeneralRepo.getExistingProductImages({
          externalSku,
        }),
      ]);

      if (getCookMethodsError) {
        return [undefined, getCookMethodsError];
      }
      if (getIngredientsError) {
        return [undefined, getIngredientsError];
      }
      if (getAllergensError) {
        return [undefined, getAllergensError];
      }
      if (getFoodTypesError) {
        return [undefined, getFoodTypesError];
      }
      if (getImagesError) {
        return [undefined, getImagesError];
      }

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
          newCookingMethodIds,
          existingCookingMethods,
          product.id,
        ),
        this.productGeneralRepo.upsertProductIngredientSet(
          newIngredientIds,
          existingIngredients,
          product.id,
        ),
        this.productGeneralRepo.upsertProductAllergenSet(
          newAllergenIds,
          existingAllergens,
          product.id,
        ),
        this.productGeneralRepo.upsertProductFoodTypeSet(
          newFoodTypeIds,
          existingFoodTypes,
          product.id,
        ),
        this.productGeneralRepo.upsertProductImageSet(
          newImages,
          existingImages,
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

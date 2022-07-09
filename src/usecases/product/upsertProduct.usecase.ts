import { Inject, Injectable } from '@nestjs/common';

import { ProductGeneralRepoInterface } from '@Repositories/teatisDB/productRepo/productGeneral.repository';
import { UpsertProductDto } from '@Controllers/ops/product/dtos/upsertProduct';
import { Product } from '@Domains/Product';

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
      // Transaction
      const [updatedProduct, upsertProductError] =
        await this.productGeneralRepo.performAtomicOperations(
          async (): Promise<[Product?, Error?]> => {
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
            const [cookingMethods, upsertCookingMethodsError] =
              await this.productGeneralRepo.upsertProductCookingMethodSet({
                newProductCookingMethodIds,
                productId: product.id,
              });
            if (upsertCookingMethodsError) {
              return [undefined, upsertCookingMethodsError];
            }

            const [ingredients, upsertIngredientsError] =
              await this.productGeneralRepo.upsertProductIngredientSet({
                newProductIngredientIds,
                productId: product.id,
              });
            if (upsertIngredientsError) {
              return [undefined, upsertIngredientsError];
            }
            const [allergen, upsertAllergenError] =
              await this.productGeneralRepo.upsertProductAllergenSet({
                newProductAllergenIds,
                productId: product.id,
              });
            if (upsertAllergenError) {
              return [undefined, upsertAllergenError];
            }
            const [foodType, upsertFoodTypesError] =
              await this.productGeneralRepo.upsertProductFoodTypeSet({
                newProductFoodTypeIds,
                productId: product.id,
              });
            if (upsertFoodTypesError) {
              return [undefined, upsertFoodTypesError];
            }
            const [image, upsertImagesError] =
              await this.productGeneralRepo.upsertProductImageSet({
                newProductImages,
                productId: product.id,
              });
            if (upsertImagesError) {
              return [undefined, upsertImagesError];
            }
            return [product];
          },
        );
      if (upsertProductError) {
        return [undefined, upsertProductError];
      }
      return [updatedProduct];
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

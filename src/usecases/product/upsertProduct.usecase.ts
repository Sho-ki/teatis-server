import { Inject, Injectable } from '@nestjs/common';

import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
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
    @Inject('ProductGeneralRepositoryInterface')
    private readonly productGeneralRepository: ProductGeneralRepositoryInterface,
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
        await this.productGeneralRepository.performAtomicOperations(
          async (): Promise<[Product?, Error?]> => {
            const [product, upsertProductError] =
              await this.productGeneralRepository.upsertProduct({
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
              await this.productGeneralRepository.upsertProductCookingMethodSet(
                {
                  newProductCookingMethodIds,
                  productId: product.id,
                },
              );
            if (upsertCookingMethodsError) {
              return [undefined, upsertCookingMethodsError];
            }

            const [ingredients, upsertIngredientsError] =
              await this.productGeneralRepository.upsertProductIngredientSet({
                newProductIngredientIds,
                productId: product.id,
              });
            if (upsertIngredientsError) {
              return [undefined, upsertIngredientsError];
            }
            const [allergen, upsertAllergenError] =
              await this.productGeneralRepository.upsertProductAllergenSet({
                newProductAllergenIds,
                productId: product.id,
              });
            if (upsertAllergenError) {
              return [undefined, upsertAllergenError];
            }
            const [foodType, upsertFoodTypesError] =
              await this.productGeneralRepository.upsertProductFoodTypeSet({
                newProductFoodTypeIds,
                productId: product.id,
              });
            if (upsertFoodTypesError) {
              return [undefined, upsertFoodTypesError];
            }
            const [image, upsertImagesError] =
              await this.productGeneralRepository.upsertProductImageSet({
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

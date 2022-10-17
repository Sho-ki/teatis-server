import { Inject, Injectable } from '@nestjs/common';

import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import { UpsertProductDto } from '@Controllers/ops/product/dtos/upsertProduct';
import { Product } from '@Domains/Product';
import { ReturnValueType } from '@Filters/customError';
import { TransactionOperatorInterface } from '@Repositories/utils/transactionOperator';

export interface UpsertProductUsecaseInterface {
  upsertProduct({
    activeStatus,
    preservationStyle,
    allergenLabel,
    ingredientLabel,
    expertComment,
    glucoseValues,
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
    weight,
  }: UpsertProductDto): Promise<ReturnValueType<Product>>;
}

@Injectable()
export class UpsertProductUsecase implements UpsertProductUsecaseInterface {
  constructor(
    @Inject('ProductGeneralRepositoryInterface')
    private readonly productGeneralRepository: ProductGeneralRepositoryInterface,
    @Inject('TransactionOperatorInterface')
    private transactionOperator: TransactionOperatorInterface,
  ) {}

  async upsertProduct({
    activeStatus,
    preservationStyle,
    allergenLabel,
    ingredientLabel,
    expertComment,
    glucoseValues,
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
    weight,
  }: UpsertProductDto): Promise<ReturnValueType<Product>> {
    // Transaction
    const [updatedProduct, upsertProductError] =
      await this.transactionOperator
        .performAtomicOperations(
          [this.productGeneralRepository],
          async (): Promise<ReturnValueType<Product>> => {
            const [product, upsertProductError] =
              await this.productGeneralRepository.upsertProduct({
                activeStatus,
                preservationStyle,
                allergenLabel,
                ingredientLabel,
                expertComment,
                glucoseValues,
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
                weight,
              });
            if (upsertProductError) {
              return [undefined, upsertProductError];
            }
            const [, upsertCookingMethodsError] =
              await this.productGeneralRepository.upsertProductCookingMethodSet({
                newProductCookingMethodIds,
                productId: product.id,
              });
            if (upsertCookingMethodsError) {
              return [undefined, upsertCookingMethodsError];
            }

            const [, upsertIngredientsError] =
              await this.productGeneralRepository.upsertProductIngredientSet({
                newProductIngredientIds,
                productId: product.id,
              });
            if (upsertIngredientsError) {
              return [undefined, upsertIngredientsError];
            }
            const [, upsertAllergenError] =
              await this.productGeneralRepository.upsertProductAllergenSet({
                newProductAllergenIds,
                productId: product.id,
              });
            if (upsertAllergenError) {
              return [undefined, upsertAllergenError];
            }
            const [, upsertFoodTypesError] =
              await this.productGeneralRepository.upsertProductFoodTypeSet({
                newProductFoodTypeIds,
                productId: product.id,
              });
            if (upsertFoodTypesError) {
              return [undefined, upsertFoodTypesError];
            }
            const [, upsertImagesError] =
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
  }
}

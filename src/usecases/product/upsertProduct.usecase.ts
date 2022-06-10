import { Inject, Injectable } from '@nestjs/common';

import { ProductGeneralRepoInterface } from '@Repositories/teatisDB/productRepo/productGeneral.repository';
import { UpsertProductDto } from '../../controllers/ops/product/dtos/upsertProduct';
import { Product } from '../../domains/Product';

export interface UpsertProductUsecaseInterface {
  upsertProduct({
    activeStatus,
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
  }: UpsertProductDto): Promise<[Product?, Error?]> {
    try {
      const [product, upsertProductError] =
        await this.productGeneralRepo.upsertProduct({
          activeStatus,
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
        });
      if (upsertProductError) {
        return [undefined, upsertProductError];
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

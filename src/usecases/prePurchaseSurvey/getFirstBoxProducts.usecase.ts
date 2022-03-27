import { Inject, Injectable } from '@nestjs/common';

import { ProductGeneralRepoInterface } from 'src/repositories/teatisDB/productRepo/productGeneral.repository';
import { GetFirstBoxProductsDto } from '../../controllers/discoveries/dtos/getFirstBoxProducts';
import { Product } from '../../domains/Product';
import { ShipheroRepoInterface } from '../../repositories/shiphero/shiphero.repository';

export interface GetFirstBoxProductsUsecaseRes {
  products: Pick<
    Product,
    'id' | 'sku' | 'label' | 'images' | 'vendor' | 'expertComment'
  >[];
}

export interface GetFirstBoxProductsUsecaseInterface {
  getFirstBoxProducts({
    id,
  }: GetFirstBoxProductsDto): Promise<[GetFirstBoxProductsUsecaseRes, Error]>;
}

@Injectable()
export class GetFirstBoxProductsUsecase
  implements GetFirstBoxProductsUsecaseInterface
{
  constructor(
    @Inject('ProductGeneralRepoInterface')
    private readonly productGeneralRepo: ProductGeneralRepoInterface,
    @Inject('ShipheroRepoInterface')
    private readonly shipheroRepo: ShipheroRepoInterface,
  ) {}

  async getFirstBoxProducts({
    id,
  }: GetFirstBoxProductsDto): Promise<[GetFirstBoxProductsUsecaseRes, Error]> {
    const [getKitComponentsRes, getKitComponentsError] =
      await this.shipheroRepo.getFirstBoxProducts({ id });

    const [getRecommentProductsRes, getRecommendProductsError] =
      await this.productGeneralRepo.getProductsBySku({
        products: getKitComponentsRes.products.map((product) => {
          return { sku: product.sku };
        }),
      });
    if (getRecommendProductsError) {
      return [null, getRecommendProductsError];
    }

    return [
      {
        products: getRecommentProductsRes.products.map((product) => {
          return {
            id: product.id,
            sku: product.sku,
            label: product.label,
            vendor: product.vendor,
            expertComment: product.expertComment,
            images: product.images,
          };
        }),
      },
      null,
    ];
  }
}

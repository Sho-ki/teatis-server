import { Inject, Injectable } from '@nestjs/common';

import { ProductGeneralRepositoryInterface } from '@Repositories/teatisDB/product/productGeneral.repository';
import { Product } from '@Domains/Product';
import { ReturnValueType } from '@Filters/customError';
import { GetAllProductsDto } from '@Controllers/ops/product/dtos/getAllProducts';

export interface GetAllProductsUsecaseInterface {
  getAllProducts({ medicalConditions }: GetAllProductsDto): Promise<ReturnValueType<Product[]>>;
}

@Injectable()
export class GetAllProductsUsecase implements GetAllProductsUsecaseInterface {
  constructor(
    @Inject('ProductGeneralRepositoryInterface')
    private readonly productGeneralRepository: ProductGeneralRepositoryInterface,
  ) {}

  async getAllProducts({ medicalConditions }: GetAllProductsDto): Promise<ReturnValueType<Product[]>> {
    // Transaction
    const [allProducts, allProductsError] =
      await this.productGeneralRepository.getAllProducts({ medicalConditions });
    if (allProductsError) {
      return [undefined, allProductsError];
    }
    return [allProducts, undefined];
  }
}

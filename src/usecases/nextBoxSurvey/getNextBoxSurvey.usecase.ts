import { Inject, Injectable } from '@nestjs/common';

import { GetNextBoxSurveyDto } from '../../controllers/discoveries/dtos/getNextBoxSurvey';
import { Product } from '../../domains/Product';
import { GetNextBoxInterface } from '../utils/nextBox';

interface GetNextBoxUsecaseArgs extends GetNextBoxSurveyDto {
  productCount: number;
}

interface GetNextBoxUsecaseRes {
  products: Pick<
    Product,
    | 'id'
    | 'sku'
    | 'name'
    | 'label'
    | 'vendor'
    | 'images'
    | 'expertComment'
    | 'ingredientLabel'
    | 'allergenLabel'
  >[];
}

export interface GetNextBoxUsecaseInterface {
  getNextBoxSurvey({
    email,
    uuid,
    productCount,
  }: GetNextBoxUsecaseArgs): Promise<[GetNextBoxUsecaseRes, Error]>;
}

@Injectable()
export class GetNextBoxUsecase implements GetNextBoxUsecaseInterface {
  constructor(
    @Inject('GetNextBoxInterface')
    private getNextBox: GetNextBoxInterface,
  ) {}

  async getNextBoxSurvey({
    email,
    uuid,
    productCount,
  }: GetNextBoxUsecaseArgs): Promise<[GetNextBoxUsecaseRes, Error]> {
    const [getNextBoxProducts, getNextBoxProductsError] =
      await this.getNextBox.getNextBoxSurvey({ email, uuid, productCount });

    if (getNextBoxProductsError) {
      return [null, getNextBoxProductsError];
    }

    return [getNextBoxProducts, null];
  }
}

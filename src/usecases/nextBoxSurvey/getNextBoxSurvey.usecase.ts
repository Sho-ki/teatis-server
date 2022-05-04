import { Inject, Injectable } from '@nestjs/common';

import { GetNextBoxSurveyDto } from '@Controllers/discoveries/dtos/getNextBoxSurvey';
import { Product } from '@Domains/Product';
import { GetNextBoxInterface } from '@Usecases/utils/getNextBox';

interface GetNextBoxUsecaseArgs extends GetNextBoxSurveyDto {
  isFirstBox: boolean;
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
    isFirstBox,
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
    isFirstBox,
  }: GetNextBoxUsecaseArgs): Promise<[GetNextBoxUsecaseRes, Error]> {
    const productCount = isFirstBox ? 15 : 30;

    const [getNextBoxProducts, getNextBoxProductsError] =
      await this.getNextBox.getNextBoxSurvey({ email, uuid, productCount });

    if (getNextBoxProductsError) {
      return [null, getNextBoxProductsError];
    }

    return [getNextBoxProducts, null];
  }
}

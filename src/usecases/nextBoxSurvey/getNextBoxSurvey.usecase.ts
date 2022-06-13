import { Inject, Injectable } from '@nestjs/common';

import { GetNextBoxSurveyDto } from '@Controllers/discoveries/dtos/getNextBoxSurvey';
import { DisplayProduct, Product } from '@Domains/Product';
import { GetNextBoxInterface } from '@Usecases/utils/getNextBox';

interface GetNextBoxUsecaseArgs extends GetNextBoxSurveyDto {
  productCount: number;
}

interface GetNextBoxUsecaseRes {
  products: DisplayProduct[];
}

export interface GetNextBoxUsecaseInterface {
  getNextBoxSurvey({
    email,
    uuid,
  }: GetNextBoxSurveyDto): Promise<[GetNextBoxUsecaseRes, Error]>;
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
  }: GetNextBoxSurveyDto): Promise<[GetNextBoxUsecaseRes, Error]> {
    let productCount = 30;
    const [getNextBoxProducts, getNextBoxProductsError] =
      await this.getNextBox.getNextBoxSurvey({ email, uuid, productCount });

    if (getNextBoxProductsError) {
      return [null, getNextBoxProductsError];
    }

    return [getNextBoxProducts, null];
  }
}

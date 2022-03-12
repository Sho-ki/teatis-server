import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from '../../repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from '../../repositories/teatisDB/productRepo/productGeneral.repository';
import { CustomerPostPurchaseSurveyRepoInterface } from '../../repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import { PostPurchaseSurvey } from '../../domains/PostPurchaseSurvey';
import { CustomerGeneralRepoInterface } from '../../repositories/teatisDB/customerRepo/customerGeneral.repository';

interface GetNextBoxUsecaseArgs {
  orderNumber: string;
  email: string;
}

export interface GetNextBoxUsecaseInterface {
  getNextBox({
    orderNumber,
    email,
  }: GetNextBoxUsecaseArgs): Promise<[any, Error]>;
}

@Injectable()
export class GetNextBoxUsecase implements GetNextBoxUsecaseInterface {
  constructor(
    @Inject('ShipheroRepoInterface')
    private shipheroRepo: ShipheroRepoInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
    @Inject('ProductGeneralRepoInterface')
    private productGeneralRepo: ProductGeneralRepoInterface,
    @Inject('CustomerPostPurchaseSurveyRepoInterface')
    private customerPostPurchaseSurveyRepo: CustomerPostPurchaseSurveyRepoInterface,
  ) {}

  async getNextBox({
    orderNumber,
    email,
  }: GetNextBoxUsecaseArgs): Promise<[any, Error]> {
    // const [allProducts, allProductsError] = await
    return;
  }
}

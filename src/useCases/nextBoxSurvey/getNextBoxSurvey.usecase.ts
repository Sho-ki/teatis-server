import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from 'src/repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from 'src/repositories/teatisDB/productRepo/productGeneral.repository';
import {
  CustomerPostPurchaseSurveyRepoInterface,
  GetCustomerProductFeedbackAnswersRes as TeatisDBGetCustomerProductFeedbackAnswersRes,
  GetCustomerRes as TeatisDBGetCustomerRes,
} from 'src/repositories/teatisDB/customerRepo/customerPostPurchaseSurvey.repository';
import { PostPurchaseSurvey } from 'src/domains/PostPurchaseSurvey';
import { CustomerGeneralRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerGeneral.repository';

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

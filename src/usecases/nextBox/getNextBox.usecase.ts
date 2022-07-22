import { Inject, Injectable } from '@nestjs/common';

import { GetNextBoxDto } from '@Controllers/discoveries/dtos/getNextBox';
import { DisplayProduct, Product } from '@Domains/Product';
import { GetSuggestionInterface } from '@Usecases/utils/getSuggestion';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';
import { PRODUCT_COUNT } from '../utils/productCount';

interface GetNextBoxUsecaseRes {
  products: DisplayProduct[];
}

export interface GetNextBoxUsecaseInterface {
  getNextBox({
    uuid,
    email,
  }: GetNextBoxDto): Promise<[GetNextBoxUsecaseRes, Error]>;
}

@Injectable()
export class GetNextBoxUsecase implements GetNextBoxUsecaseInterface {
  constructor(
    @Inject('GetSuggestionInterface')
    private getSuggestionUntil: GetSuggestionInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async getNextBox({
    uuid,
    email,
  }: GetNextBoxDto): Promise<[GetNextBoxUsecaseRes, Error]> {
    const productCount = PRODUCT_COUNT * 2;

    const [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomer({ email });

    // const [customer, getCustomerError] =
    //   await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    if (getCustomerError) {
      return [undefined, getCustomerError];
    }
    const [getSuggestion, getSuggestionError] =
      await this.getSuggestionUntil.getSuggestion({
        customer,
        productCount,
      });

    if (getSuggestionError) {
      return [null, getSuggestionError];
    }

    return [getSuggestion, null];
  }
}

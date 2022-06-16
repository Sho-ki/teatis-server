import { Inject, Injectable } from '@nestjs/common';

import { GetNextBoxDto } from '@Controllers/discoveries/dtos/getNextBox';
import { DisplayProduct, Product } from '@Domains/Product';
import { GetSuggestionInterface } from '@Usecases/utils/getSuggestion';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';

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
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
  ) {}

  async getNextBox({
    uuid,
    email,
  }: GetNextBoxDto): Promise<[GetNextBoxUsecaseRes, Error]> {
    let productCount = 30;

    const [customer, getCustomerError] =
      await this.customerGeneralRepo.getCustomer({ email });

    // const [customer, getCustomerError] =
    //   await this.customerGeneralRepo.getCustomerByUuid({ uuid });

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

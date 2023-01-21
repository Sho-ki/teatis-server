import { Inject, Injectable } from '@nestjs/common';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';

import { GetFirstBoxDto } from '@Controllers/discoveries/dtos/getFirstBox';

import { DisplayProduct } from '@Domains/Product';
import { GetSuggestionInterface } from '../utils/getSuggestion';
// TODO : Use DisplayProduct[] as Response
export interface GetFirstBoxRes {
  products: DisplayProduct[];
}

export interface GetFirstBoxUsecaseInterface {
  getFirstBox({ uuid }: GetFirstBoxDto): Promise<[GetFirstBoxRes?, Error?]>;
}

@Injectable()
export class GetFirstBoxUsecase implements GetFirstBoxUsecaseInterface {
  constructor(
    @Inject('GetSuggestionInterface')
    private getSuggestionUntil: GetSuggestionInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async getFirstBox({ uuid }: GetFirstBoxDto): Promise<[GetFirstBoxRes?, Error?]> {
    const [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    if (getCustomerError) {
      return [undefined, getCustomerError];
    }
    const firstIncludeSkus = [
      'x10326-RTD-SN20167',
      'x10267-CHP-SN20137',
      'x10244-SWT-SN20138',
      'x10262-COK-SN20113',
      'x10261-CHP-SN20133',
      'x10325-JRK-SN20177',
      'x10217-CHP-SN20144',
    ];

    const firstExcludeSkus = [
      'x10249-SHK-SN20143',
      'x10231-CHP-SN20116',
      'x10221-CHP-SN20101',
      'x10263-BAR-SN20154',
      'x10212-CHP-SN20153',
    ];
    const productCount = 12;
    const [getSuggestion, getSuggestionError] =
      await this.getSuggestionUntil.getSuggestion({
        customer,
        productCount,
        includeProducts: firstIncludeSkus.map((sku) => {
          return { sku };
        }),
        excludeProducts: firstExcludeSkus.map((sku) => {
          return { sku };
        }),
      });

    if (getSuggestionError) {
      return [undefined, getSuggestionError];
    }
    return [getSuggestion, undefined];
  }
}

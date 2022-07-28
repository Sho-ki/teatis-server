import { Inject, Injectable } from '@nestjs/common';
import { CustomerGeneralRepositoryInterface } from '@Repositories/teatisDB/customer/customerGeneral.repository';

import { GetFirstBoxDto } from '@Controllers/discoveries/dtos/getFirstBox';

import { DisplayProduct } from '@Domains/Product';
import { GetSuggestionInterface } from '../utils/getSuggestion';
import { PRODUCT_COUNT } from '../utils/productCount';
import { ReturnValueType } from '../../filter/customerError';

export interface GetFirstBoxRes {
  products: DisplayProduct[];
}

export interface GetFirstBoxUsecaseInterface {
  getFirstBox({ uuid }: GetFirstBoxDto): Promise<ReturnValueType<GetFirstBoxRes>>;
}

@Injectable()
export class GetFirstBoxUsecase implements GetFirstBoxUsecaseInterface {
  constructor(
    @Inject('GetSuggestionInterface')
    private getSuggestionUntil: GetSuggestionInterface,
    @Inject('CustomerGeneralRepositoryInterface')
    private customerGeneralRepository: CustomerGeneralRepositoryInterface,
  ) {}

  async getFirstBox({ uuid }: GetFirstBoxDto): Promise<ReturnValueType<GetFirstBoxRes>> {
    const [customer, getCustomerError] =
      await this.customerGeneralRepository.getCustomerByUuid({ uuid });

    if (getCustomerError) {
      return [undefined, getCustomerError];
    }
    const firstIncludeSkus = [
      'x10263-BAR-SN20154',
      'x10244-SWT-SN20138',
      'x10230-SOU-SN20135', // LS
      'x10239-RTD-SN20139',
      'x10262-COK-SN20113',
      'x10261-CHP-SN20133',
      'x10212-CHP-SN20153',
      'x10325-JRK-SN20177',
      'x10217-CHP-SN20144',
    ];

    const firstExcludeSkus = [
      'x10249-SHK-SN20143',
      'x10253-SOU-SN20100',
      'x10256-OAT-SN20152',
      'x10231-CHP-SN20116',
      'x10221-CHP-SN20101',
    ];
    const productCount = PRODUCT_COUNT;
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
    return [getSuggestion, null];
  }
}

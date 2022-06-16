import { Inject, Injectable } from '@nestjs/common';

import { ShipheroRepoInterface } from '@Repositories/shiphero/shiphero.repository';
import { ProductGeneralRepoInterface } from '@Repositories/teatisDB/productRepo/productGeneral.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';

import { GetFirstBoxDto } from '@Controllers/discoveries/dtos/getFirstBox';

import {
  DisplayAnalyzeProduct,
  DisplayProduct,
  Product,
} from '@Domains/Product';
import {
  AnalyzePreferenceArgs,
  AnalyzePreferenceRepoInterface,
  CustomerShippableProduct,
} from '@Repositories/dataAnalyze/dataAnalyzeRepo';
import { GetSuggestionInterface } from '../utils/getSuggestion';

export interface GetFirstBoxRes {
  products: DisplayProduct[];
}

interface FilterProductsArgs {
  filterType:
    | 'inventry'
    | 'flavorDislikes'
    | 'allergens'
    | 'unavailableCookingMethods'
    | 'unwant';
  customerFilter: { id?: number[]; sku?: string[] };
  products: DisplayAnalyzeProduct[];
  nextWantProducts?: Product[];
}

export interface GetFirstBoxUsecaseInterface {
  getFirstBox({ uuid }: GetFirstBoxDto): Promise<[GetFirstBoxRes, Error]>;
}

@Injectable()
export class GetFirstBoxUsecase implements GetFirstBoxUsecaseInterface {
  constructor(
    @Inject('GetSuggestionInterface')
    private getSuggestionUntil: GetSuggestionInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
  ) {}

  async getFirstBox({
    uuid,
  }: GetFirstBoxDto): Promise<[GetFirstBoxRes, Error]> {
    let productCount = 30;
    const [customer, getCustomerError] =
      await this.customerGeneralRepo.getCustomerByUuid({ uuid });

    if (getCustomerError) {
      return [undefined, getCustomerError];
    }
    const firstIncludeSkus = [
      'x10245-GUM-SN20102',
      'x10208-CHC-SN20124',
      'x10204-SWT-SN20114',
      'x10230-SOU-SN20135',
      'x10262-COK-SN20113',
      'x10244-SWT-SN20138',
    ];

    const firstExcludeSkus = [
      'x10249-SHK-SN20143',
      'x10253-SOU-SN20100',
      'x10256-OAT-SN20152',
      'x10231-CHP-SN20116',
      'x10221-CHP-SN20101',
    ];

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
      return [null, getSuggestionError];
    }

    return [getSuggestion, null];
  }
}

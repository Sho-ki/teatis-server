import { Inject, Injectable } from '@nestjs/common';

import { CustomerBoxRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerBox.repository';
import { Status } from 'src/domains/Status';

import { OrderQueueRepoInterface } from '@Repositories/teatisDB/orderRepo/orderQueue.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CreateCartDto } from '../../controllers/discoveries/dtos/createCart';
import { ShopifyRepoInterface } from '../../repositories/shopify/shopify.repository';

interface CreateCustomerCartUsecaseRes {
  checkoutUrl: string;
  email: string;
}
export interface CreateCustomerCartUsecaseInterface {
  createCart({
    merchandiseId,
    sellingPlanId,
    uuid,
  }: CreateCartDto): Promise<[CreateCustomerCartUsecaseRes, Error]>;
}

@Injectable()
export class CreateCustomerCartUsecase
  implements CreateCustomerCartUsecaseInterface
{
  constructor(
    @Inject('ShopifyRepoInterface')
    private ShopifyRepo: ShopifyRepoInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
  ) {}

  // need to delete CustomerBox every time products are shipped, since customers may not answer the next post-purchase-survey
  // which causes sending the same products as the previous order
  async createCart({
    merchandiseId,
    sellingPlanId,
    uuid,
  }: CreateCartDto): Promise<[CreateCustomerCartUsecaseRes, Error]> {
    const [createCartRes, createCartError] = await this.ShopifyRepo.createCart({
      merchandiseId,
      sellingPlanId,
      uuid,
    });
    if (createCartError) {
      return [null, createCartError];
    }

    const [Customer, getCustomerError] =
      await this.customerGeneralRepo.getCustomerByUuid({ uuid });

    if (getCustomerError) {
      return [null, getCustomerError];
    }

    return [
      { checkoutUrl: createCartRes.checkoutUrl, email: Customer.email },
      null,
    ];
  }
}

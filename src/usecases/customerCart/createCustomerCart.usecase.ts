import { Inject, Injectable } from '@nestjs/common';

import { CustomerBoxRepoInterface } from 'src/repositories/teatisDB/customerRepo/customerBox.repository';
import { Status } from 'src/domains/Status';

import { OrderQueueRepoInterface } from '@Repositories/teatisDB/orderRepo/orderQueue.repository';
import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CreateCartDto } from '../../controllers/discoveries/dtos/createCart';
import { ShopifyRepoInterface } from '../../repositories/shopify/shopify.repository';

interface CreateCustomerCartUsecaseRes {
  checkoutUrl: string;
}
export interface CreateCustomerCartUsecaseInterface {
  createCart({
    email,
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
  ) {}

  // need to delete CustomerBox every time products are shipped, since customers may not answer the next post-purchase-survey
  // which causes sending the same products as the previous order
  async createCart({
    email,
    merchandiseId,
    sellingPlanId,
    uuid,
  }: CreateCartDto): Promise<[CreateCustomerCartUsecaseRes, Error]> {
    const [createCartRes, createCartError] = await this.ShopifyRepo.createCart({
      email,
      merchandiseId,
      sellingPlanId,
      uuid,
    });

    return [{ checkoutUrl: createCartRes.checkoutUrl }, null];
  }
}

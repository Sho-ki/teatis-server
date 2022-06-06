import { Inject, Injectable } from '@nestjs/common';

import { CustomerGeneralRepoInterface } from '@Repositories/teatisDB/customerRepo/customerGeneral.repository';
import { CreateCheckoutCartOfCustomerOriginalBoxDto } from '@Controllers/discoveries/dtos/createCheckoutCartOfCustomerOriginalBoxDto';
import { ShopifyRepoInterface } from '@Repositories/shopify/shopify.repository';
import { Customer } from '@Domains/Customer';

interface CreateCheckoutCartOfCustomerOriginalBoxUsecaseRes {
  checkoutUrl: string;
  email?: string;
}
export interface CreateCheckoutCartOfCustomerOriginalBoxUsecaseInterface {
  createCheckoutCartOfCustomerOriginalBox({
    merchandiseId,
    sellingPlanId,
    uuid,
  }: CreateCheckoutCartOfCustomerOriginalBoxDto): Promise<
    [CreateCheckoutCartOfCustomerOriginalBoxUsecaseRes, Error]
  >;
}

@Injectable()
export class CreateCheckoutCartOfCustomerOriginalBoxUsecase
  implements CreateCheckoutCartOfCustomerOriginalBoxUsecaseInterface
{
  constructor(
    @Inject('ShopifyRepoInterface')
    private ShopifyRepo: ShopifyRepoInterface,
    @Inject('CustomerGeneralRepoInterface')
    private customerGeneralRepo: CustomerGeneralRepoInterface,
  ) {}

  async createCheckoutCartOfCustomerOriginalBox({
    merchandiseId,
    sellingPlanId,
    uuid,
  }: CreateCheckoutCartOfCustomerOriginalBoxDto): Promise<
    [CreateCheckoutCartOfCustomerOriginalBoxUsecaseRes, Error]
  > {
    const attributes: { key: string; value: string }[] = [
      { key: 'uuid', value: uuid },
    ];
    const [customer, getCustomerError] =
      await this.customerGeneralRepo.getCustomerByUuid({
        uuid,
      });

    if (getCustomerError) {
      return [null, getCustomerError];
    }
    const [cart, createCheckoutCartOfCustomerOriginalBoxError] =
      await this.ShopifyRepo.createCart({
        merchandiseId,
        sellingPlanId,
        attributes,
      });
    if (createCheckoutCartOfCustomerOriginalBoxError) {
      return [null, createCheckoutCartOfCustomerOriginalBoxError];
    }

    return [{ checkoutUrl: cart.checkoutUrl, email: customer.email }, null];
  }
}
